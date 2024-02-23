// Used to controll our player
var PlayerController = pc.createScript('playerController');

PlayerController.prototype.initialize = function () {
    this.app.playerController = this;
    this.networkEntity = this.entity.script.networkEntity;

    // Set up model
    if (this.networkEntity.user) {
        const charNum = this.networkEntity.user.id % 4;
        this.modelEntity = this.entity.children[0];
        const body = this.modelEntity.children[0];
        body.children[charNum].enabled = true;
    }

    if (!this.networkEntity.mine) return;

    // Setup All variables
    this.setupVariables();

    // Setup All event listener
    this.setupEventListeners();

    // Setup Level data
    this.setupLevelData();

    // Set Worldlight
    const worldLight = this.app.root.findByName("WorldLight");
    if (worldLight) worldLight.light.intensity = 0.1;
};

PlayerController.prototype.setupLevelData = function () {
    const level = this.app.root.findByName("Level");

    const p2 = level.findByName("P2. Algorithm");
    if (p2) p2.enabled = false;

    const p3 = level.findByName("P3. Rbtree");
    if (p3) p3.enabled = false;

    const p3_2 = level.findByName("P3-2. Malloc-lab");
    if (p3_2) p3_2.enabled = false;

    const p4 = level.findByName("circuit board");
    if (p4) p4.enabled = false;

    const p5 = level.findByName("P5. End");
    if (p5) p5.enabled = false;
}

PlayerController.prototype.setupVariables = function () {
    // 내 플레이어 전역변수로 설정
    ME = this.entity;

    this.user = this.networkEntity.user;

    // User input list
    this.isWPressed = false;
    this.isSPressed = false;
    this.isAPressed = false;
    this.isDPressed = false;
    this.isSpacePressed = false;

    this.isZPressed = false;
    this.isXPressed = false;
    this.isCPressed = false;
    this.isVPressed = false;
    this.isBPressed = false;

    this.isUPressed = false;
    this.isIPressed = false;

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
    this.nameTag = this.entity.findByName('Nametag');

    // Anim state
    this.entity.isRunning = false;   
    this.entity.isJumping = false;  
    this.entity.isAttacking = false;
    this.entity.isHit = false;
    this.entity.isVictory = false;
    this.entity.isVow = false;

    // For custom PC reaction
    this.entity.pcReactOn = false;
    this.controllable = true;
    
    // VFX emitter
    this.vfx = this.entity.findByName('vfx');

    // Custom timer
    this.animTimerAttack = 0;

    // End trigger
    this.endpoint = false;
    this.automove = false;
    this.endHaha = false;
    this.endBow = false;

    // Rank
    this.entity.rank = 0;

    // Camera
    this.bvEnabled = false;
    this.qvEnabled = false;
}

PlayerController.prototype.setupEventListeners = function () {
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.mouseDown, this);
    this.entity.collision.on("triggerenter", this.onTriggerEnter, this);
    this.entity.collision.on("collisionstart", this.onCollisionStart, this);
}

PlayerController.prototype.onTriggerEnter = function (target) {

}

PlayerController.prototype.onCollisionStart = function (hit) {
    if (hit.other.tags.has('endpoint')) {
        this.endpoint = true;
        CAMERA.endPoint = true;
    }
    
    if (hit.other.tags.has('automove')) {
        this.automove = true;
        const worldLight = this.app.root.findByName('WorldLight');
        if (worldLight) {
            worldLight.enabled = false;
        }
        const spotLight = this.entity.findByName('SpotLightPC');
        if (spotLight) {
            spotLight.enabled = true;
        }
    }

    if (hit.other.tags.has('redcarpet')) {
        if (!this.entity.sound.slot('cheer').isPlaying) {
            this.entity.sound.play("cheer");

            // Play vfx
            const firework = this.vfx.findByName('firework');
            firework.script.effekseerEmitter.play();
        }
    }

    if (!this.bvEnabled && hit.other.tags.has('backview')) {
        CAMERA.isMoving = true;
        CAMERA.isBackView = true;
        this.bvEnabled = true;
    }
    
    if (!this.qvEnabled && hit.other.tags.has('quarterview')) {
        CAMERA.isMoving = true;
        CAMERA.isBackView = false;
        this.qvEnabled = true;
    }

    if (hit.other.tags.has('triggerhaha')) {
        this.endHaha = true;
    }

    // Level enable/disable
    const level = this.app.root.findByName('Level');
    const points = [
        'P0. Start_Bedroom',
        'P1. Hello World',
        'P2. Algorithm',
        'P3. Rbtree',
        'P3-2. Malloc-lab',
        'circuit board',
        'P5. End'
    ];

    points.forEach((pointName, index) => {
        const point = level.findByName(pointName);
        
        if (hit.other.tags.has(`p${index}_on`)) {
            point.enabled = true;
        } else if (hit.other.tags.has(`p${index}_off`)) {
            point.enabled = false;
        }
    });
}


// Event listner on mouse click
PlayerController.prototype.mouseDown = function (e) {
    if (e.button === pc.MOUSEBUTTON_LEFT && !this.entity.isAttacking && this.entity.canJump && !this.entity.isHit) {
        // Set mouse input
        this.clientInput.mouse_LEFT = true;

        // Set anim state to attacking
        this.entity.isVictory = false;
        this.entity.isVow = false;
        this.entity.isAttacking = true;

        // Play swing sound
        this.entity.sound?.play("swing");
    }
}

PlayerController.prototype.update = function (dt) {
    if (!this.networkEntity.mine) return;

    // Check custom timer
    this.checkCustomTimer(dt);

    // Get user input
    this.getUserInput();

    // Set state of model entity
    this.setModelEntityState();

    // Handle server signals to apply appropriate responses or actions
    this.handleServerSignals();

    // Send input data to server
    this.sendInputToServer();

    // Test for enable / disable
    this.togglePhase();
};

PlayerController.prototype.checkCustomTimer = function (dt) {
    if (this.entity.isAttacking) {
        this.animTimerAttack += dt;
        if (this.animTimerAttack >= 0.5) {
            this.animTimerAttack = 0;
            this.entity.isAttacking = false;
        }
    }
}

PlayerController.prototype.getUserInput = function () {
    this.isWPressed = this.app.keyboard.isPressed(pc.KEY_W);
    this.isAPressed = this.app.keyboard.isPressed(pc.KEY_A);
    this.isSPressed = this.app.keyboard.isPressed(pc.KEY_S);
    this.isDPressed = this.app.keyboard.isPressed(pc.KEY_D);
    this.isSpacePressed = this.app.keyboard.isPressed(pc.KEY_SPACE);

    this.isZPressed = this.app.keyboard.isPressed(pc.KEY_Z);
    this.isXPressed = this.app.keyboard.isPressed(pc.KEY_X);
    this.isCPressed = this.app.keyboard.isPressed(pc.KEY_C);
    this.isVPressed = this.app.keyboard.isPressed(pc.KEY_V);
    this.isBPressed = this.app.keyboard.isPressed(pc.KEY_B);

    this.isUPressed = this.app.keyboard.isPressed(pc.KEY_U);
    this.isIPressed = this.app.keyboard.isPressed(pc.KEY_I);

    if (this.automove) {
        this.isWPressed = true;
        this.isAPressed = false;
        this.isSPressed = false;
        this.isDPressed = true;
        this.isSpacePressed = false;
    }
}


PlayerController.prototype.togglePhase = function () {
    if (this.app.keyboard.wasPressed(pc.KEY_1)) {
        const level = this.app.root.findByName('Level');
        const p0 = level.findByName('P0. Start_Bedroom');
        const p1 = level.findByName('P1. Hello World');
        if (p0) {
            if (p0.enabled) {
                p0.enabled = false;
            } else {
                p0.enabled = true;
            }
        }   
        if (p1) {
            if (p1.enabled) {
                p1.enabled = false;
            } else {
                p1.enabled = true;
            }
        }    
    }

    if (this.app.keyboard.wasPressed(pc.KEY_2)) {
        const level = this.app.root.findByName('Level');
        const p2 = level.findByName('P2. Algorithm');
        if (p2) {
            if (p2.enabled) {
                p2.enabled = false;
            } else {
                p2.enabled = true;
            }
        }    
    }

    if (this.app.keyboard.wasPressed(pc.KEY_3)) {
        const level = this.app.root.findByName('Level');
        const p3 = level.findByName('P3. Rbtree');
        if (p3) {
            if (p3.enabled) {
                p3.enabled = false;
            } else {
                p3.enabled = true;
            }
        }    
    }

    if (this.app.keyboard.wasPressed(pc.KEY_4)) {
        const level = this.app.root.findByName('Level');
        const p4 = level.findByName('P3-2. Malloc-lab');
        if (p4) {
            if (p4.enabled) {
                p4.enabled = false;
            } else {
                p4.enabled = true;
            }
        }    
    }

    if (this.app.keyboard.wasPressed(pc.KEY_5)) {
        const level = this.app.root.findByName('Level');
        const p5 = level.findByName('circuit board');
        if (p5) {
            if (p5.enabled) {
                p5.enabled = false;
            } else {
                p5.enabled = true;
            }
        }    
    }

    if (this.app.keyboard.wasPressed(pc.KEY_6)) {
        const level = this.app.root.findByName('Level');
        const p6 = level.findByName('P5. End');
        if (p6) {
            if (p6.enabled) {
                p6.enabled = false;
            } else {
                p6.enabled = true;
            }
        }    
    }
}

// Set anim state and rotation of model entity
PlayerController.prototype.setModelEntityState = function () {
    // If there is custom pc react, skip setting model entities
    if (this.entity.pcReactOn) {
        this.modelEntity.anim.setBoolean("isRunning", false);
        this.modelEntity.anim.setBoolean("isJumping", false);
        this.modelEntity.anim.setBoolean("isAttacking", false);
        this.modelEntity.anim.setBoolean("isHit", this.entity.isHit);
        this.modelEntity.anim.setBoolean("isVictory", false);
        this.modelEntity.anim.setBoolean("isVow", false);
        return;
    }

    if (CAMERA.isBackView) {
        var dirZ = this.isSPressed - this.isWPressed;
        var dirX = this.isDPressed - this.isAPressed;
    } else {
        var dirZ = (this.isSPressed + this.isAPressed) - (this.isWPressed + this.isDPressed);
        var dirX = (this.isDPressed + this.isSPressed) - (this.isAPressed + this.isWPressed);
    };

    // If there is a direction, set 'isRunning' to true
    if (dirZ != 0 || dirX != 0) {
        this.entity.isVictory = false;
        this.entity.isVow = false;
        this.entity.isRunning = true;
    } else {
        this.entity.isRunning = false;
    }

    // If there is a user input from WASD, check if model entity should be rotated
    if (this.isWPressed || this.isAPressed || this.isSPressed || this.isDPressed) {
        // Rotate the model to proper direction
        var newAngle = 90 - (Math.atan2(dirZ, dirX) * pc.math.RAD_TO_DEG);
        this.modelEntity.setEulerAngles(0, newAngle, 0);
    }

    // Check if player is jumping
    if (this.entity.canJump) {
        this.entity.isJumping = false;
        if (this.isSpacePressed) {
            if (!this.entity.sound.slot('jump').isPlaying) {
                this.entity.sound.play("jump");
            }
        }
    } else {
        this.entity.isVictory = false;
        this.entity.isVow = false;
        this.entity.isJumping = true;
    }

    if (this.isUPressed) {
        this.entity.isVow = false;
        this.entity.isVictory = true;
    }

    if (this.isIPressed) {
        this.entity.isVictory = false;
        this.entity.isVow = true;
    }

    // Update anim state of player
    this.modelEntity.anim.setBoolean("isRunning", this.entity.isRunning);
    this.modelEntity.anim.setBoolean("isJumping", this.entity.isJumping);
    this.modelEntity.anim.setBoolean("isAttacking", this.entity.isAttacking);
    this.modelEntity.anim.setBoolean("isHit", this.entity.isHit);
    this.modelEntity.anim.setBoolean("isVictory", this.entity.isVictory);
    this.modelEntity.anim.setBoolean("isVow", this.entity.isVow);
}

// 
PlayerController.prototype.handleServerSignals = function () {
    var signals = this.entity.signalToClient;
    if (signals?.length !== 0) {

        if (signals?.includes('pc_reaction')) {
            this.entity.isRunning = false;
        }

        if (signals?.includes('savepoint')) {
            if (!this.entity.sound.slot('cheer').isPlaying) {
                this.entity.sound.play("cheer");

            // Play vfx
            const firework = this.vfx.findByName('firework');
            firework.script.effekseerEmitter.play();
            }
        }  
    } 
}

// Send input data to server
PlayerController.prototype.sendInputToServer = function () {
    if (!this.networkEntity) return;

    // Check keyboard input
    this.clientInput.key_W = this.isWPressed;
    this.clientInput.key_S = this.isSPressed;
    this.clientInput.key_A = this.isAPressed;
    this.clientInput.key_D = this.isDPressed;
    this.clientInput.key_SPACE = this.isSpacePressed;

    this.clientInput.key_Z = this.isZPressed;
    this.clientInput.key_X = this.isXPressed;
    this.clientInput.key_C = this.isCPressed;
    this.clientInput.key_V = this.isVPressed;
    this.clientInput.key_B = this.isBPressed;

    this.clientInput.key_U = this.isUPressed;
    this.clientInput.key_I = this.isIPressed;

    // Get model rotation
    const modelRotation = this.modelEntity.getEulerAngles();

    this.networkEntity.send('input', {
        clientInput : this.clientInput,
        animState : {isRunning : this.entity.isRunning, isJumping : this.entity.isJumping, isAttacking : this.entity.isAttacking, isHit : this.entity.isHit, isVictory : this.entity.isVictory, isVow : this.entity.isVow},
        modelRotation : {x : modelRotation.x, y : modelRotation.y, z : modelRotation.z},
        view : CAMERA.isBackView
    })

    // Set to default state
    this.clientInput = {...this.clientInputDefault};
}