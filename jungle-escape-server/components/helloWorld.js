var HelloWorld = pc.createScript('helloWorld');

import pn from '../custom_modules/playnetwork/src/server/index.js';

HelloWorld.attributes.add('positionYCurve', { type: 'curve' });

HelloWorld.prototype.initialize = function () {
    this.time = 0;
    this.activations = 0;
    this.isCountingDown = false;
    this.countdownTimer = 0;
    this.countdown = 4;
    this.isStarted = false;
    this.elapsedTime = 0;

    this.entity.on('activation', this.onActivation, this);
};

HelloWorld.prototype.swap = function (old) {
    this.time = old.time;
    this.activations = old.activations;
    this.isCountingDown = old.isCountingDown;
    this.countdownTimer = old.countdownTimer;
    this.countdown = old.countdown;
    this.isStarted = old.isStarted;
    this.elapsedTime = old.elapsedTime;

    old.entity.off('activation', old.onActivation, old);
    this.entity.on('activation', this.onActivation, this);
};

HelloWorld.prototype.onActivation = function (activated) {
    if (activated) {
        this.activations += 1;
    } else {
        this.activations -= 1;
    }
    this.activations = pc.math.clamp(this.activations, 0, 2);
};

HelloWorld.prototype.update = function (dt) {
    if (this.activations === 1) {
        // 두 버튼이 모두 활성화되었을 때 게이트 움직임 처리
        this.time += dt;
        if (this.time >= 1 && !this.isCountingDown) {
            this.isCountingDown = true;
        }
    } else {
        // 두 버튼 중 하나라도 비활성화되면 게이트 움직임 처리
        this.time -= dt;
    }

    this.time = pc.math.clamp(this.time, 0, 1);

    if (!this.isStarted && this.isCountingDown) {
        if (this.countdownTimer >= 1 && this.countdown > 0) {
            this.countdownTimer = 0;
            this.countdown -= 1;
            this.entity.networkEntity.send('start', `${this.countdown.toString()}...`);

            if (this.countdown === 0) {
                this.isCountingDown = false;
                this.entity.networkEntity.send('start', 'START!!');
                this.entity.networkEntity.send('falling');
                this.entity.children.forEach(child1 => {
                    child1.children.forEach(child2 => {
                        child2.children.forEach(child3 => {
                            if (child3.tags.has('falling_platform')) {
                                child3.rigidbody.type = pc.BODYTYPE_DYNAMIC;

                                var force = new pc.Vec3(-50, 0, -25); // Y축 방향으로 10의 힘
                                var position = child3.getPosition(); // 힘을 적용할 위치

                                child3.rigidbody.applyForce(force, position);
                            }
                        });
                    });
                });
                this.isStarted = true;
            }
        } else {
            this.countdownTimer += dt;
        }
    }

    if (this.isStarted) {
        this.elapsedTime += dt;
        this.entity.networkEntity.send('time', this.elapsedTime);

        var list = [];
        var pointA = new pc.Vec3(0, 0, -620);
        for (let [id, networkEntity] of pn.networkEntities) {
            var u = networkEntity;
            if (u.user) {
                var pointB = u.rules.position()
                var distance = pointA.distance(pointB);
                let info = [distance, `user ${u.user.id}`];
                list.push(info);
            }
        }
        list.sort((a, b) => {
            return a[0] - b[0];
        });
        this.entity.networkEntity.send('rank', list)
        // this.app.room.send('rank', list);
    };
};