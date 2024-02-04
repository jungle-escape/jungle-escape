var PlayerController = pc.createScript("playerController");

PlayerController.attributes.add("speed", { type: "number", default: 12 });
PlayerController.attributes.add("maxSpeed", { type: "number", default: 50 });
PlayerController.attributes.add("moveForce", {
  type: "number",
  default: 5000,
});
PlayerController.attributes.add("jumpForce", { type: "number", default: 1500 });
PlayerController.attributes.add("linearDamping", {
  type: "vec3",
  default: [0.99, 0, 0.99],
});

PlayerController.prototype.initialize = function () {
  this.user = this.entity.networkEntity.user;

  if (!this.user) return;

  // Server only
  this.entity.networkEntity.on("input", this.setInput, this);
  this.user.once("leave", this.removeInputHandler, this);
  this.once("destroy", this.removeInputHandler, this);

  // Setup all variables
  this.setupVariables();

  // Setup all event listener
  this.setupEventListeners();
};

PlayerController.prototype.setupVariables = function () {
  this.clientInput = {
    key_W: false,
    key_A: false,
    key_S: false,
    key_D: false,
    key_SPACE: false,
    mouse_LEFT: false,
  };

  this.direction = new pc.Vec3(0, 0, 0);
  this.velocity = new pc.Vec3(0, 0, 0);
  this.lookAt = new pc.Vec3(0, 0, 0);
  this.canJump = true;

  // Get component of template 'PC'
  this.modelEntity = this.entity.children[0]; // NOTE : Model must be FIRST children of entity
  this.nameTag = this.entity.children[1];

  // For custom linear damping
  this.linearDampingOriginal = new pc.Vec3(
    this.linearDamping.x,
    this.linearDamping.y,
    this.linearDamping.z
  );
  this.dampTimer = 0;
  this.dampDuration = 0;
  this.dampChanged = false;

  // For custom PC reaction
  this.pcReactTimer = 0;
  this.pcReactDuration = 0;
  this.pcReactOn = false;
  this.controllable = true;

  // For moving panels
  this.isOnPanel = false;
  this.panelEntity = null;
};

PlayerController.prototype.setupEventListeners = function () {
  this.entity.collision.on("contact", this.onContact, this);
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
  this.entity.collision.on("collisionend", this.onCollisionEnd, this);
};

PlayerController.prototype.swap = function (old) {
  this.user = old.user;

  if (old.user) {
    old.user.off("input", old.setInput, old);
    old.user.off("leave", old.removeInputHandler, old);
    old.off("destroy", old.removeInputHandler, old);
  }

  if (this.user) {
    this.user.on("input", this.setInput, this);
    this.user.once("leave", this.removeInputHandler, this);
    this.once("destroy", this.removeInputHandler, this);
  }
};

PlayerController.prototype.setInput = function (sender, data) {
  if (sender !== this.user) return;
  this.clientInput = data.clientInput;
  data.animState.canJump = this.canJump;
  this.entity.animState = data.animState;
  this.entity.modelRotation = data.modelRotation;

  // Check push
  this.checkPush();
};

PlayerController.prototype.removeInputHandler = function () {
  this.user.off("input", this.setInput, this);
};

PlayerController.prototype.update = function (dt) {
  this.checkCustomTimer(dt);

  // Handle user falling
  this.handleUserFalling();

  // Handling user input if player is controllable
  if (this.controllable) {
    this.handleUserInputMovement(dt); // Related to user movement
  }

  // Apply linear damping to player
  this.applyLinearDamping(dt);

  // Apply velocity cap(=maxSpeed) to player
  this.clampPlayerVelocity();

  // console.log("this entity : ", this.entity.name);
  // console.log("move force : ", this.moveForce);
  // console.log("lv : ", this.entity.rigidbody.linearVelocity);
};

// Given input from client, move player character in server world
PlayerController.prototype.handleUserInputMovement = function (dt) {
  // Set player direction with user keyboard input
  this.direction.x = this.clientInput.key_D - this.clientInput.key_A;
  this.direction.z = this.clientInput.key_S - this.clientInput.key_W;
  var moveDirection = new pc.Vec3(this.direction.x, 0, this.direction.z);
  if (moveDirection.lengthSq() > 0) {
    moveDirection.normalize();
    this.lookAt = new pc.Vec3(
      moveDirection.x,
      moveDirection.y,
      moveDirection.z
    );
  }

  // Apply force for X, Z movement
  var movement = moveDirection.scale(dt * this.moveForce);
  this.entity.rigidbody.applyForce(movement);

  // Jump
  if (this.canJump && this.clientInput.key_SPACE) {
    this.canJump = false;
    this.entity.rigidbody.applyImpulse(0, this.jumpForce, 0);

    this.jumpTimeout = setTimeout(() => {
      this.jumpTimeout = null;
    }, 250);
  }
};

PlayerController.prototype.checkCustomTimer = function (dt) {
  // Check if custom damp is active and reset if it should be
  if (this.dampChanged) {
    this.dampTimer += dt;
    if (this.dampTimer >= this.dampDuration) {
      this.linearDamping = this.linearDampingOriginal;
      this.dampChanged = false;
      this.dampTimer = 0;
    }
  }

  // Check if custom reaction is active and reset if it should be
  if (this.pcReactOn) {
    this.pcReactTimer += dt;
    if (this.pcReactTimer >= this.pcReactDuration) {
      this.pcReactOn = false;
      this.pcReactTimer = 0;
      this.entity.rigidbody.angularVelocity = new pc.Vec3(0, 0, 0);
      this.controllable = true;
    }
  }
};

PlayerController.prototype.handleUserFalling = function () {
  // Respawn if fell below the floor
  if (this.entity.getPosition().y < -10) {
    var savePoint = this.entity.savePoint;
    if (savePoint) {
      this.entity.setPosition(savePoint);
      this.entity.rigidbody.teleport(savePoint);
    } else {
      this.entity.setPosition(0, 4, 0);
      this.entity.rigidbody.teleport(0, 0, 0);
    }
    this.entity.rigidbody.linearVelocity =
      this.entity.rigidbody.linearVelocity.set(0, 0, 0);
  }
};

PlayerController.prototype.applyLinearDamping = function (dt) {
  ////////////////// Bullet Original code //////////////////////////////
  // m_linearVelocity *= btPow(btScalar(1) - m_linearDamping, timeStep);
  //////////////////////////////////////////////////////////////////////

  // Apply linear damping
  var lv = this.entity.rigidbody.linearVelocity;
  lv.x *= Math.pow(1 - this.linearDamping.x, dt);
  lv.y *= Math.pow(1 - this.linearDamping.y, dt);
  lv.z *= Math.pow(1 - this.linearDamping.z, dt);

  this.entity.rigidbody.linearVelocity = new pc.Vec3(lv.x, lv.y, lv.z);
};

// Clamp player velocity to maxspeed
PlayerController.prototype.clampPlayerVelocity = function () {
  var lv = this.entity.rigidbody.linearVelocity;

  // Clamp lv.x, lv.y, and lv.z if any exceeds this.maxSpeed
  if (Math.abs(lv.x) > this.maxSpeed) {
    lv.x = Math.sign(lv.x) * this.maxSpeed;
  }
  if (Math.abs(lv.y) > this.maxSpeed) {
    lv.y = Math.sign(lv.y) * this.maxSpeed;
  }
  if (Math.abs(lv.z) > this.maxSpeed) {
    lv.z = Math.sign(lv.z) * this.maxSpeed;
  }

  // Set lv to rigidbody
  this.entity.rigidbody.linearVelocity = new pc.Vec3(lv.x, lv.y, lv.z);
};

// Event listner on collision start
PlayerController.prototype.onCollisionStart = function (hit) {
  this.checkCollisionStartRules(hit);
};

PlayerController.prototype.checkCollisionStartRules = function (hit) {
  // PC common reaction, play sound and rotate model entity for 1 sec
  if (hit.other.tags.has("pc_reaction")) {
    this.entity.sound.play("reaction");
    this.entity.rigidbody.applyTorqueImpulse(0, 10000, 0);
    this.pcReactTimer = 0;
    this.pcReactDuration = 1;
    this.pcReactOn = true;
  }

  // Wrong answer sound
  if (hit.other.tags.has("wrong")) {
    this.entity.sound.play("wrong");
  }

  // Make player out of control for 1 sec
  if (hit.other.tags.has("take_control")) {
    this.controllable = false;
    this.pcReactTimer = 0;
    this.pcReactDuration = 1;
    this.pcReactOn = true;
  }

  // Push player back in the direction opposite to 'other'.
  if (hit.other.tags.has("push_opposite")) {
    var otherPos = hit.other.getPosition();
    var playerPos = this.entity.getPosition();
    var pushDirection = playerPos.clone().sub(otherPos).normalize();
    pushDirection.y = 0;
    var movement = pushDirection.scale(50000);
    this.entity.rigidbody.applyImpulse(movement);
  }

  //
  if (hit.other.tags.has("movingPanel")) {
    this.isOnPanel = true;
    this.panelEntity = hit.other;
  }

  // Phase 4 temp jump fix
  if (hit.other.tags.has("phase4")) {
    this.canJump = true;
  }
};

// Event listener on collision contact
PlayerController.prototype.onContact = function (hit) {
  // Check all custom rules of collision
  this.checkContactRules(hit);

  // Jump
  if (this.jumpTimeout) return;

  for (let i = 0; i < hit.contacts.length; i++) {
    if (hit.contacts[i].normal.dot(pc.Vec3.DOWN) > 0.5) {
      this.canJump = true;
      break;
    }
  }
};

PlayerController.prototype.checkContactRules = function (hit) {
  // Example2
  if (hit.other.tags.has("icy")) {
    // Set custom damping rules and duration
    this.dampChanged = true;
    this.linearDamping = new pc.Vec3(0.9, 0, 0.9);
    this.dampDuration = 1;
    this.dampTimer = 0;
  }
  // x 발판 뒤로튕기기
  if (hit.other.tags.has("x")) {
    this.entity.rigidbody.linearVelocity =
      this.entity.rigidbody.linearVelocity.set(0, 10, 50);
    this.canJump = false;
  }
};

// Event listner on collision end
PlayerController.prototype.onCollisionEnd = function (hit) {
  if (hit.tags?.has("movingPanel")) {
    this.isOnPanel = false;
    this.panelEntity = null;
  }
};

// Event listner on mouse click
PlayerController.prototype.checkPush = function () {
  if (this.clientInput.mouse_LEFT) {
    // Cast from player
    var castStart = this.entity.getPosition();
    var distance = 5;
    var castEnd = castStart.clone().add(this.lookAt.scale(distance));

    // Cast from player
    var result = this.app.systems.rigidbody.raycastFirst(castStart, castEnd);

    // Apply force, opposite to given normal vector
    if (result) {
      if (result.entity.rigidbody) {
        var pushForce = 10000;
        var pushVec = result.normal.scale(-1 * pushForce);
        result.entity.rigidbody.applyImpulse(pushVec);
      }
    }
  }
};

// //////////////////////////////
// // Logics for Moving Panels //
// //////////////////////////////

// // logic for calculating panel's movement vector
// PlayerController.prototype.syncPosWithPanel = function () {
//     if (this.isOnPanel && this.panelEntity) {
//         var panelDeltaMovement = this.calculatePanelDeltaMovement();

//         if (panelDeltaMovement) {
//             var currentPosition = this.entity.getPosition();
//             this.entity.rigidbody.teleport(
//                 currentPosition.x + panelDeltaMovement.x,
//                 currentPosition.y + panelDeltaMovement.y,
//                 currentPosition.z + panelDeltaMovement.z
//             );
//         }
//     }
// }

// PlayerController.prototype.calculatePanelDeltaMovement = function () {
//     var panelEntity = this.panelEntity;
//     var lastPosition = panelEntity.script.movementConstSpeed.lastPosition || panelEntity.getPosition().clone();
//     var currentPosition = panelEntity.getPosition();
//     panelEntity.script.movementConstSpeed.lastPosition = currentPosition.clone();

//     return currentPosition.clone().sub(lastPosition);
// }
