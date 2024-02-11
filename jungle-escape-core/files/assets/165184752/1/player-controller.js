// Used to controll our player
var PlayerController = pc.createScript('playerController');

PlayerController.prototype.initialize = function () {
    this.networkEntity = this.entity.script.networkEntity;

    if (!this.networkEntity.mine) return;

    // Setup All variables
    this.setupVariables();

    // Setup All event listener
    this.setupEventListeners();
};

PlayerController.prototype.setupVariables = function () {
    // 내 플레이어 전역변수로 설정
    ME = this.entity;

    this.user = this.networkEntity.user;

    // User input, will be sent to server
    this.clientInput = {
        key_W : false,
        key_A : false,
        key_S : false,
        key_D : false,
        key_SPACE : false,
        mouse_LEFT : false
    }
    this.clientInputDefault = {...this.clientInput};

    // Get component of template 'PC'
    this.modelEntity = this.entity.children[0];     // NOTE : Model must be FIRST children of entity
    this.nameTag = this.entity.children[1];

    // Anim state
    this.entity.isRunning = false;   
    this.entity.isJumping = false;  

    // For custom PC reaction
    this.entity.pcReactOn = false;
    this.controllable = true;
}

PlayerController.prototype.setupEventListeners = function () {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.mouseDown, this);
}

// Event listner on mouse click
PlayerController.prototype.mouseDown = function (e) {
    if (e.button === pc.MOUSEBUTTON_LEFT) {
        // Set mouse input
        this.clientInput.mouse_LEFT = true;

        // Visualize raycast
        var castStart = this.entity.getPosition();
        var distance = 5;
        var forward = this.modelEntity.forward.scale(-1);
        var castEnd = castStart.clone().add(forward.clone().scale(distance));

        this.app.drawLine(castStart, castEnd, new pc.Color(1, 0, 0));
    }
}

PlayerController.prototype.update = function (dt) {
    if (!this.networkEntity.mine) return;

    // Set state of model entity
    this.setModelEntityState();

    // Handle collision tags to apply appropriate responses or actions
    this.handleCollisionTags();

    // Send input data to server
    this.sendInputToServer();
};

// Set anim state and rotation of model entity
PlayerController.prototype.setModelEntityState = function () {
    // If there is custom pc react, skip setting model entities
    if (this.entity.pcReactOn) {
        return;
    }

    // Check if WASD or Space keys are pressed
    var isWPressed = this.app.keyboard.isPressed(pc.KEY_W);
    var isAPressed = this.app.keyboard.isPressed(pc.KEY_A);
    var isSPressed = this.app.keyboard.isPressed(pc.KEY_S);
    var isDPressed = this.app.keyboard.isPressed(pc.KEY_D);
    var isSpacePressed = this.app.keyboard.isPressed(pc.KEY_SPACE);

    if (CAMERA.isBackView) {
        var dirZ = isSPressed - isWPressed;
        var dirX = isDPressed - isAPressed;
    } else {
        var dirZ = (isSPressed + isAPressed) - (isWPressed + isDPressed);
        var dirX = (isDPressed + isSPressed) - (isAPressed + isWPressed);
    };

    // If there is a direction, set 'isRunning' to true
    if (dirZ != 0 || dirX != 0) {
        this.entity.isRunning = true;
    } else {
        this.entity.isRunning = false;
    }

    // If there is a user input from WASD, check if model entity should be rotated
    if (isWPressed || isAPressed || isSPressed || isDPressed) {
        // Rotate the model to proper direction
        var newAngle = 90 - (Math.atan2(dirZ, dirX) * pc.math.RAD_TO_DEG);
        this.modelEntity.setEulerAngles(0, newAngle, 0);
    }

    // Check if player is jumping
    if (this.entity.canJump) {
        this.entity.isJumping = false;
        if (isSpacePressed) {
            if (!this.entity.sound.slot('jump').isPlaying) {
                this.entity.sound.play("jump");
            }
        }
    } else {
        this.entity.isJumping = true;
    }

    // Update anim state of player
    this.modelEntity.anim.setBoolean("isRunning", this.entity.isRunning);
    this.modelEntity.anim.setBoolean("isJumping", this.entity.isJumping);
}

// 
PlayerController.prototype.handleCollisionTags = function () {
    var tags = this.entity.collisionTags;
    if (tags?.length !== 0) {
        // tag : pc_reaction
        if (tags?.includes('pc_reaction')) {
            if (!this.entity.sound.slot('reaction').isPlaying) {
                this.entity.sound.play("reaction");
            }
        }
        // tag : wrong
        if (tags?.includes('wrong')) {
            if (!this.entity.sound.slot('wrong').isPlaying) {
                this.entity.sound.play("wrong");
            }
        }
        // tag : savepoint
        if (tags?.includes('savepoint')) {
            if (!this.entity.sound.slot('cheer').isPlaying) {
                this.entity.sound.play("cheer");
            }
        }   
        // tag : savepoint
        if (tags?.includes('fall')) {
            if (!this.entity.sound.slot('fall').isPlaying) {
                this.entity.sound.play("fall");
            }
        } 
        // tag : segfault
        if (tags?.includes('segfault')) {
            if (!this.entity.sound.slot('segfault').isPlaying) {
                this.entity.sound.play("segfault");
            }
        }    
        // tag : rightanswer  
        if (tags?.includes('rightanswer')) {
            if (!this.entity.sound.slot('rightanswer').isPlaying) {
                this.entity.sound.play("rightanswer");
            }
        }   
        // tag : hammer  
        if (tags?.includes('hammer')) {
            if (!this.entity.sound.slot('hammer').isPlaying) {
                this.entity.sound.play("hammer");
            }
        }       
    }
}

// Send input data to server
PlayerController.prototype.sendInputToServer = function () {
    if (!this.networkEntity) return;

    // Check keyboard input
    this.clientInput.key_W = this.app.keyboard.isPressed(pc.KEY_W);
    this.clientInput.key_S = this.app.keyboard.isPressed(pc.KEY_S);
    this.clientInput.key_A = this.app.keyboard.isPressed(pc.KEY_A);
    this.clientInput.key_D = this.app.keyboard.isPressed(pc.KEY_D);
    this.clientInput.key_SPACE = this.app.keyboard.isPressed(pc.KEY_SPACE);

    // Get model rotation
    const modelRotation = this.modelEntity.getEulerAngles();

    this.networkEntity.send('input', {
        clientInput : this.clientInput,
        animState : {isRunning : this.entity.isRunning, isJumping : this.entity.isJumping},
        modelRotation : {x : modelRotation.x, y : modelRotation.y, z : modelRotation.z},
        view : CAMERA.isBackView
    })

    // Set to default state
    this.clientInput = {...this.clientInputDefault};
}