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

  // Set level data
  this.setupLevelData();
};

PlayerController.prototype.setupVariables = function () {
  global.ME = this.entity;

  // Default client input value
  this.clientInput = {
    key_W: false,
    key_A: false,
    key_S: false,
    key_D: false,
    key_SPACE: false,
    mouse_LEFT: false,
  };

  // Player state
  this.direction = new pc.Vec3(0, 0, 0);
  this.velocity = new pc.Vec3(0, 0, 0);
  this.lookAt = new pc.Vec3(0, 0, 0);
  this.canJump = true;

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

  // For handling collisions, will be sent to client
  this.entity.collisionTags = [];

  // Savepoint
  this.entity.savepoint1 = false;
  this.entity.savepoint2 = false;
  this.entity.savepoint3 = false;
  this.entity.savepoint4 = false;

  // Get boxcast entity
  this.boxCast = this.entity.findByName("BoxCast");
};

PlayerController.prototype.setupEventListeners = function () {
  this.entity.collision.on("contact", this.onContact, this);
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
  this.entity.collision.on("collisionend", this.onCollisionEnd, this);
};

PlayerController.prototype.setupLevelData = function () {
  // NOTE : Server-side levels will always be enaled
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

PlayerController.prototype.setInput = function (sender, data) {
  if (sender !== this.user) return;
  this.clientInput = data.clientInput;
  data.animState.canJump = this.canJump;
  data.animState.pcReactOn = this.pcReactOn;
  data.animState.collisionTags = this.entity.collisionTags;
  this.entity.animState = data.animState;
  this.entity.modelRotation = data.modelRotation;
  this.view = data.view;

  // Check if a push should be executed given client input
  this.doPush();
};

PlayerController.prototype.removeInputHandler = function () {
  this.user.off("input", this.setInput, this);
};

PlayerController.prototype.update = function (dt) {
  // Reset collision tags when update function starts
  this.entity.collisionTags = [];

  // Check custom timer of PC entity
  this.checkCustomTimer(dt);

  // Check if user has to be respawned
  this.checkUserRespawn();

  // Handling user input, if player is controllable
  if (this.controllable) {
    this.handleUserInput(dt);
  }

  // Apply linear damping to player
  this.applyLinearDamping(dt);

  // Apply velocity cap(=maxSpeed) to player
  this.clampPlayerVelocity();
};

// Given input from client, manipulate character in server world
PlayerController.prototype.handleUserInput = function (dt) {
  // Set direction of server-side player with user keyboard input, considering player camera view
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

  // Apply force(move) for X, Z movement
  var movement = moveDirection.scale(dt * this.moveForce);
  // var radian = 45 * Math.PI / 180;
  this.entity.rigidbody.applyForce(movement);

  // Do jump with user keyboard input
  if (this.canJump && this.clientInput.key_SPACE) {
    this.canJump = false;
    this.entity.rigidbody.applyImpulse(0, this.jumpForce, 0);

    this.jumpTimeout = setTimeout(() => {
      this.jumpTimeout = null;
    }, 250);
  }

  // Teleporting based on client input
  this.teleportToSavepoint("key_Z", "P2. Algorithm", "savepoint1");
  this.teleportToSavepoint("key_X", "P3. Rbtree", "savepoint2");
  this.teleportToSavepoint("key_C", "P3-2. Malloc-lab", "savepoint3");
  this.teleportToSavepoint("key_V", "circuit board", "savepoint4");
  this.teleportToSavepoint("key_B", "P5. End", "teleport");

  // For playing sound
  if (this.clientInput.key_U) {
    this.entity.collisionTags.push("haha");
  }

  if (this.clientInput.key_I) {
    this.entity.collisionTags.push("byebye");
  }
};

// Teleport to savepoint based on key input
PlayerController.prototype.teleportToSavepoint = function (
  key,
  sectionName,
  savepointName
) {
  if (this.clientInput[key]) {
    const section = this.app.root.findByName("Level").findByName(sectionName);
    const savepoint = section ? section.findByName(savepointName) : null;
    if (savepoint) {
      const toPos = savepoint.getPosition();
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

PlayerController.prototype.checkUserRespawn = function () {
  // Check if player should be respawned, with its position
  const MIN_Y = -10;
  const MAX_X = 300;
  const DEFAULT_RESPAWN_POS = new pc.Vec3(0, 4, 0);

  const playerPos = this.entity.getPosition();

  if (playerPos.y < MIN_Y || playerPos.x > MAX_X) {
    const respawnPoint = this.entity.savePoint || DEFAULT_RESPAWN_POS;
    this.entity.setPosition(respawnPoint);
    this.entity.rigidbody.teleport(respawnPoint);
    this.entity.rigidbody.linearVelocity.set(0, 0, 0);
    this.entity.collisionTags.push("fall");
  }
};

PlayerController.prototype.applyLinearDamping = function (dt) {
  ////////////////// Bullet Original code //////////////////////////////
  // m_linearVelocity *= btPow(btScalar(1) - m_linearDamping, timeStep);
  //////////////////////////////////////////////////////////////////////

  var lv = this.entity.rigidbody.linearVelocity;
  const EXTRA_GRAVITY = -15;
  const JUMP_DAMPING = 0.999;

  if (this.canJump) {
    // Grounded linear damping
    const dampingX = Math.pow(1 - this.linearDamping.x, dt);
    const dampingY =
      lv.y > 0
        ? Math.pow(1 - 0.99, dt)
        : Math.pow(1 - this.linearDamping.y, dt);
    const dampingZ = Math.pow(1 - this.linearDamping.z, dt);

    lv.x *= dampingX;
    lv.y *= dampingY;
    lv.z *= dampingZ;
  } else {
    // Airborne linear damping
    const airDamping = Math.pow(1 - JUMP_DAMPING, dt);
    lv.x *= airDamping;
    lv.z *= airDamping;

    if (lv.y <= 0) {
      lv.y += EXTRA_GRAVITY * dt;
    }
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

  if (hit.other.tags.has("spin")) {
    this.entity.rigidbody.applyTorqueImpulse(0, 10000, 0);
    this.pcReactTimer = 0;
    this.pcReactDuration = 1;
    this.pcReactOn = true;
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
    const playerPos = this.entity.getPosition();
    this.entity.setPosition(playerPos.z, playerPos.y + 1, playerPos.z);
    var movement = new pc.Vec3(1, 0.01, 0).scale(450000);
    this.entity.rigidbody.applyImpulse(movement);
  }

  if (hit.other.tags.has("hit")) {
    this.entity.collisionTags.push("hit");
  }

  if (hit.other.tags.has("automove")) {
    this.moveForce = 120000;
  }

  if (hit.other.tags.has("endpoint")) {
    this.moveForce = 180000;
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

// Do push, invoked by client mouse left-click
PlayerController.prototype.doPush = function () {
  if (this.clientInput.mouse_LEFT) {
    // // Cast from player
    // var pcPos = this.entity.getPosition().clone();
    // var castStart = pcPos.clone().add(this.lookAt.clone().scale(3));
    // var castEnd = pcPos.clone().add(this.lookAt.clone().scale(6));

    // // Cast from player
    // var result = this.app.systems.rigidbody.raycastFirst(castStart, castEnd);

    // // Apply force, opposite to given normal vector
    // if (result) {
    //   if (result.entity.rigidbody) {
    //     var pushForce = 10000;
    //     // var pushVec = result.normal.scale(-1 * pushForce);
    //     var pushVec = this.lookAt.scale(pushForce);
    //     result.entity.rigidbody.applyImpulse(pushVec);
    //     if (result.entity.tags.has("player")) {
    //       result.entity.collisionTags.push("hit_receive");
    //     }
    //     this.entity.collisionTags.push("hit_success");
    //   }
    // }

    // Push by boxcast
    if (this.boxCast) {
      if (!this.boxCast.enabled) {
        this.boxCast.enabled = true;
      }
    }
  }
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
