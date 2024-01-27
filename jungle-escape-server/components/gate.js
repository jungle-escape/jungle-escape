var Gate = pc.createScript('gate');

Gate.attributes.add('positionYCurve', { type: 'curve' });

Gate.prototype.initialize = function () {
    this.defaultPositionY = this.entity.getPosition().y;
    this.vec3 = new pc.Vec3();
    this.time = 0;
    this.activations = 0;

    this.entity.on('activation', this.onActivation, this);
};

Gate.prototype.swap = function (old) {
    this.defaultPositionY = old.defaultPositionY;
    this.vec3 = old.vec3;
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
        if (this.time >= 1) {
            this.isOpened = true;
        }
    } else {
        // 두 버튼 중 하나라도 비활성화되면 게이트 움직임 처리
        this.time -= dt;
    }

    this.time = pc.math.clamp(this.time, 0, 1);

    this.vec3.copy(this.entity.getPosition());
    if (this.isOpened) {
        this.vec3.y = this.defaultPositionY + this.positionYCurve.value(1);
    } else {
        this.vec3.y = this.defaultPositionY + this.positionYCurve.value(this.time);
    }
    this.entity.rigidbody.teleport(this.vec3);
};
