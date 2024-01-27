// Used to controll our player
var PlayerController = pc.createScript('playerController');

PlayerController.attributes.add('speed', { type: 'number', default: 6 });
PlayerController.attributes.add('jumpForce', { type: 'number', default: 1500 });

PlayerController.prototype.initialize = function () {
    this.networkEntity = this.entity.script.networkEntity;

    if (!this.networkEntity.mine) return;

    this.user = this.networkEntity.user;
    this.direction = new pc.Vec3();
    this.velocity = new pc.Vec3();
    this.canJump = true;
    // NOTE : Model must be FIRST children of entity
    this.modelEntity = this.entity.children[0];
    // Initial anim state of player
    this.entity.isRunning = false;
    this.entity.isJumping = false;

    this.entity.collision.on('contact', this.onContact, this);
};

PlayerController.prototype.update = function () {
    if (!this.networkEntity.mine) return;

    // direction
    this.direction.x = this.app.keyboard.isPressed(pc.KEY_D) - this.app.keyboard.isPressed(pc.KEY_A);
    this.direction.z = this.app.keyboard.isPressed(pc.KEY_S) - this.app.keyboard.isPressed(pc.KEY_W);

    // jump
    if (this.canJump && this.app.keyboard.wasPressed(pc.KEY_SPACE)) {
        this.canJump = false;
        this.entity.rigidbody.applyImpulse(0, this.jumpForce, 0);

        this.jumpTimeout = setTimeout(() => {
            this.jumpTimeout = null;
        }, 250);
    }

    // Set state of model entity
    this.setModelEntityState();

    // apply forces
    this.velocity.set(this.direction.x, 0, this.direction.z).mulScalar(this.speed);
    this.entity.rigidbody.linearVelocity = this.entity.rigidbody.linearVelocity.set(this.velocity.x, this.entity.rigidbody.linearVelocity.y, this.velocity.z);

    const position = this.entity.getPosition();
    const linearVelocity = this.entity.rigidbody.linearVelocity;
    const angularVelocity = this.entity.rigidbody.angularVelocity;

    if (!this.networkEntity) return;

    // Get Euler angle of model entity
    const modelRotation = this.modelEntity.getEulerAngles();

    this.networkEntity.send('input', {
        position: { x: position.x, y: position.y, z: position.z },                                  //
        linearVelocity: { x: linearVelocity.x, y: linearVelocity.y, z: linearVelocity.z },          //
        angularVelocity: { x: angularVelocity.x, y: angularVelocity.y, z: angularVelocity.z },      //
        modelRotation : { x: modelRotation.x, y: modelRotation.y, z: modelRotation.z},              // Send rotation info of model
        animState: {isRunning : this.entity.isRunning, isJumping : this.entity.isJumping}           // Send anim state of player to server
    });

    console.log("velocity of this entity : ", this.entity.rigidbody.linearVelocity);
};

PlayerController.prototype.onContact = function (hit) {
    if (this.jumpTimeout) return;

    for (let i = 0; i < hit.contacts.length; i++) {
        if (hit.contacts[i].normal.dot(pc.Vec3.DOWN) > 0.5) {
            this.canJump = true;
            break;
        }
    }
};

// Set anim state and rotation of model entity
PlayerController.prototype.setModelEntityState = function () {
    // Update anim state of player
    this.modelEntity.anim.setBoolean("isRunning", this.entity.isRunning);
    this.modelEntity.anim.setBoolean("isJumping", this.entity.isJumping);

    // If there is a direction, set 'isRunning' to true
    if (this.direction.x != 0 || this.direction.z != 0) {
        this.entity.isRunning = true;
    } else {
        this.entity.isRunning = false;
    }

    // Check if WASD or Space keys are pressed
    var isWPressed = this.app.keyboard.isPressed(pc.KEY_W);
    var isAPressed = this.app.keyboard.isPressed(pc.KEY_A);
    var isSPressed = this.app.keyboard.isPressed(pc.KEY_S);
    var isDPressed = this.app.keyboard.isPressed(pc.KEY_D);
    var isSpacePressed = this.app.keyboard.isPressed(pc.KEY_SPACE);

    // If there is a user input from WASD or Space key, check if anim state should be changed
    if (isWPressed || isAPressed || isSPressed || isDPressed) {
        // Rotate the model to proper direction
        var newAngle = 90 - (Math.atan2(this.direction.z, this.direction.x) * pc.math.RAD_TO_DEG);
        this.modelEntity.setEulerAngles(0, newAngle, 0);
    }
    if (isSpacePressed && !this.canJump) {
        this.entity.isJumping = true;
    } else if (!isSpacePressed && this.canJump) {
        this.entity.isJumping = false;
    }
}
