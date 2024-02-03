var Gate = pc.createScript('gate');

// import pn from '../custom_modules/playnetwork/src/server/index.js';

Gate.attributes.add('positionYCurve', { type: 'curve' });

Gate.prototype.initialize = function () {
    // this.defaultPositionY = this.entity.getPosition().y;
    // this.vec3 = new pc.Vec3();
    this.time = 0;
    this.activations = 0;

    this.entity.on('activation', this.onActivation, this);
};

Gate.prototype.swap = function (old) {
    // this.defaultPositionY = old.defaultPositionY;
    // this.vec3 = old.vec3;
    this.time = old.time;
    this.activations = old.activations;

    old.entity.off('activation', old.onActivation, old);
    this.entity.on('activation', this.onActivation, this);
};

Gate.prototype.onActivation = function (activated) {
    if (activated) {
        this.activations += 1;
    } else {
        this.activations -= 1;
    }
    this.activations = pc.math.clamp(this.activations, 0, 2);
};

Gate.prototype.update = function (dt) {
    if (this.activations === 2) {
        // 두 버튼이 모두 활성화되었을 때 게이트 움직임 처리
        this.time += dt;
        if (this.time >= 1 && !this.isCountingDown) {
            this.entity.networkEntity.send('go');
        }
    } else {
        // 두 버튼 중 하나라도 비활성화되면 게이트 움직임 처리
        this.time -= dt;
    }

    this.time = pc.math.clamp(this.time, 0, 1);

    // this.vec3.copy(this.entity.getPosition());
    // if (this.isOpened && this.isCountingDown) {
    //     if (this.countdownTimer >= 1 && this.countdown > 0) {
    //         this.countdownTimer = 0;
    //         this.countdown -= 1;
    //         this.entity.networkEntity.send('start', `${this.countdown.toString()}...`);

    //         if (this.countdown === 0) {
    //             this.isCountingDown = false;
    //             this.entity.networkEntity.send('start', 'START!!');
    //             this.vec3.y = this.defaultPositionY + this.positionYCurve.value(1);
    //             this.entity.rigidbody.teleport(this.vec3);
    //             this.isStarted = true;
    //         }
    //     } else {
    //         this.countdownTimer += dt;
    //     }
    // }

    // if (this.isStarted) {
    //     this.elapsedTime += dt;
    //     this.entity.networkEntity.send('time', this.elapsedTime);

    //     var list = [];
    //     var pointA = new pc.Vec3(0, 0, -620);
    //     for (let [id, networkEntity] of pn.networkEntities) {
    //         var u = networkEntity;
    //         if (u.user) {
    //             var pointB = u.rules.position()
    //             var distance = pointA.distance(pointB);
    //             let info = [distance, `user ${u.user.id}`];
    //             list.push(info);
    //         }
    //     }
    //     list.sort((a, b) => {
    //         return a[0] - b[0];
    //     });
    //     this.app.room.send('rank', list);
    // };
};
