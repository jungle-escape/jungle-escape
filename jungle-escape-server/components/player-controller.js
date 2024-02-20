var PlayerController = pc.createScript("playerController");

PlayerController.attributes.add("speed", { type: "number", default: 12 });
PlayerController.attributes.add("maxSpeed", { type: "number", default: 50 });
PlayerController.attributes.add("moveForce", {
  type: "number",
  default: 5000,
});
PlayerController.attributes.add("jumpForce", { type: "number", default: 2000 });
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

  // Test code
  const level = this.app.root.findByName("Level");

  const p2 = level.findByName("P2. Algorithm");
  if (p2) p2.enabled = true;

  const p3 = level.findByName("P3. Rbtree");
  if (p3) p3.enabled = true;

  const p3_2 = level.findByName("P3-2. Malloc-lab");
  if (p3_2) p3_2.enabled = true;

  const p4 = level.findByName("circuit board");
  if (p4) p4.enabled = true;

  const p5 = level.findByName("P5. End");
  if (p5) p5.enabled = true;
};

PlayerController.prototype.setupVariables = function () {
  global.ME = this.entity;

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
  ``;
  // For moving panels
  this.isOnPanel = false;
  this.panelEntity = null;

  // For handling collisions, will be sent to clinet
  this.entity.collisionTags = [];

  // Savepoint temp fix
  this.entity.savepoint1 = false;
  this.entity.savepoint2 = false;
  this.entity.savepoint3 = false;
  this.entity.savepoint4 = false;
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
  data.animState.pcReactOn = this.pcReactOn;
  data.animState.collisionTags = this.entity.collisionTags;
  this.entity.animState = data.animState;
  this.entity.modelRotation = data.modelRotation;
  this.view = data.view;

  // Check push
  this.doPush();
};

PlayerController.prototype.removeInputHandler = function () {
  this.user.off("input", this.setInput, this);
};

PlayerController.prototype.update = function (dt) {
  // Reset collision tags
  this.entity.collisionTags = [];

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
};

// Given input from client, move player character in server world
PlayerController.prototype.handleUserInputMovement = function (dt) {
  // Set player direction with user keyboard input
  if (!this.view) {
    this.direction.x =
      this.clientInput.key_D +
      this.clientInput.key_S -
      (this.clientInput.key_W + this.clientInput.key_A);
    this.direction.z =
      this.clientInput.key_A +
      this.clientInput.key_S -
      (this.clientInput.key_W + this.clientInput.key_D);
  } else {
    this.direction.x = this.clientInput.key_D - this.clientInput.key_A;
    this.direction.z = this.clientInput.key_S - this.clientInput.key_W;
  }
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
  // var radian = 45 * Math.PI / 180;
  // 쿼터뷰시 너무 빠르다면 movementForce / radian 해주세요
  this.entity.rigidbody.applyForce(movement);

  // Jump
  if (this.canJump && this.clientInput.key_SPACE) {
    this.canJump = false;
    this.entity.rigidbody.applyImpulse(0, this.jumpForce, 0);

    this.jumpTimeout = setTimeout(() => {
      this.jumpTimeout = null;
    }, 250);
  }

  // Teleport to savepoint
  const level = this.app.root.findByName("Level");
  if (this.clientInput.key_Z) {
    const p2 = level.findByName("P2. Algorithm");
    var savepoint = p2.findByName("savepoint1");
    if (savepoint) {
      var toPos = savepoint.getPosition();
      this.entity.setPosition(toPos);
      this.entity.rigidbody.teleport(toPos);
    }
  }

  if (this.clientInput.key_X) {
    const p3 = level.findByName("P3. Rbtree");
    var savepoint = p3.findByName("savepoint2");
    if (savepoint) {
      var toPos = savepoint.getPosition();
      this.entity.setPosition(toPos);
      this.entity.rigidbody.teleport(toPos);
    }
  }

  if (this.clientInput.key_C) {
    const p3_2 = level.findByName("P3-2. Malloc-lab");
    var savepoint = p3_2.findByName("savepoint3");
    if (savepoint) {
      var toPos = savepoint.getPosition();
      this.entity.setPosition(toPos);
      this.entity.rigidbody.teleport(toPos);
    }
  }

  if (this.clientInput.key_V) {
    const p4 = level.findByName("circuit board");
    var savepoint = p4.findByName("savepoint4");
    if (savepoint) {
      var toPos = savepoint.getPosition();
      this.entity.setPosition(toPos);
      this.entity.rigidbody.teleport(toPos);
    }
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
    this.entity.rigidbody.linearVelocity.y = 0;
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
      this.entity.rigidbody.teleport(0, 4, 0);
    }
    this.entity.rigidbody.linearVelocity =
      this.entity.rigidbody.linearVelocity.set(0, 0, 0);
    this.entity.collisionTags.push("fall");
  }
};

PlayerController.prototype.applyLinearDamping = function (dt) {
  ////////////////// Bullet Original code //////////////////////////////
  // m_linearVelocity *= btPow(btScalar(1) - m_linearDamping, timeStep);
  //////////////////////////////////////////////////////////////////////

  // Apply linear damping
  var lv = this.entity.rigidbody.linearVelocity;
  if (this.canJump) {
    lv.x *= Math.pow(1 - this.linearDamping.x, dt);
    if (lv.y > 0) {
      lv.y *= Math.pow(1 - 0.99, dt);
    } else {
      lv.y *= Math.pow(1 - this.linearDamping.y, dt);
    }
    lv.z *= Math.pow(1 - this.linearDamping.z, dt);
  } else if (!this.canJump) {
    // Damping applied when player is jumping
    lv.x *= Math.pow(1 - 0.999, dt);
    if (lv.y <= 0) {
      var extraGravity = -15;
      lv.y += extraGravity * dt;
    }
    lv.z *= Math.pow(1 - 0.999, dt);
  }

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
  // Can jump initialize
  if (hit.other.tags.has("ground")) {
    this.canJump = true;
  }

  // PC common reaction, play sound and rotate model entity for 1 sec
  if (hit.other.tags.has("pc_reaction")) {
    this.entity.rigidbody.applyTorqueImpulse(0, 10000, 0);
    this.pcReactTimer = 0;
    this.pcReactDuration = 1;
    this.pcReactOn = true;
    this.entity.collisionTags.push("pc_reaction");
  }

  // Wrong answer sound
  if (hit.other.tags.has("wrong")) {
    this.entity.collisionTags.push("wrong");
  }

  // Make player out of control for 1 sec
  if (hit.other.tags.has("take_control")) {
    this.controllable = false;
    this.pcReactTimer = 0;
    this.pcReactDuration = 1;
    this.pcReactOn = true;
    this.entity.collisionTags.push("take_control");
  }

  // Push player back in the direction opposite to 'other'.
  if (hit.other.tags.has("push_opposite")) {
    var otherPos = hit.other.getPosition();
    var playerPos = this.entity.getPosition();
    var pushDirection = playerPos.clone().sub(otherPos).normalize();
    pushDirection.y = 0;
    var movement = pushDirection.scale(50000);
    this.entity.rigidbody.applyImpulse(movement);
    this.entity.collisionTags.push("push_opposite");
  }

  //
  if (hit.other.tags.has("movingPanel")) {
    this.isOnPanel = true;
    this.panelEntity = hit.other;
    this.entity.collisionTags.push("movingPanel");
  }

  // Push player back in the direction opposite to 'other'.
  if (hit.other.tags.has("push_error")) {
    var otherPos = hit.other.getPosition();
    var playerPos = this.entity.getPosition();
    var pushDirection = playerPos.clone().sub(otherPos).normalize();
    pushDirection.y = 0;
    var movement = pushDirection.scale(150000);
    this.entity.rigidbody.applyImpulse(movement);
  }

  if (hit.other.tags.has("segfault")) {
    this.entity.collisionTags.push("segfault");
  }

  if (hit.other.tags.has("rightanswer")) {
    this.entity.collisionTags.push("rightanswer");
  }

  if (hit.other.tags.has("hammer")) {
    // this.entity.collisionTags.push("hammer");
    var movement = new pc.Vec3(1, 0.001, 0).scale(450000);
    this.entity.rigidbody.applyImpulse(movement);
  }

  if (hit.other.tags.has("hit")) {
    this.entity.collisionTags.push("hit");
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

PlayerController.prototype.checkContactRules = function (hit) {};

// Event listner on collision end
PlayerController.prototype.onCollisionEnd = function (hit) {
  if (hit.tags?.has("movingPanel")) {
    this.isOnPanel = false;
    this.panelEntity = null;
  }
};

// Do push, invoked by client mouse left-click
PlayerController.prototype.doPush = function () {
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
        // var pushVec = result.normal.scale(-1 * pushForce);
        var pushVec = this.lookAt.scale(pushForce);
        result.entity.rigidbody.applyImpulse(pushVec);
        if (result.entity.tags.has("player")) {
          result.entity.collisionTags.push("hit_receive");
        }
        this.entity.collisionTags.push("hit_success");
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
