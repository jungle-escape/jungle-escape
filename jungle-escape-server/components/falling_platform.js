var FallingPlatform = pc.createScript("fallingPlatform");


FallingPlatform.prototype.initialize = function () {
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

FallingPlatform.prototype.swap = function (old) {
    this.entity.collision.off('collisionstart', old.onCollisionStart, old);
    this.entity.collision.on('collisionstart', this.onCollisionStart, this);
};

FallingPlatform.prototype.update = function () {
    if (this.entity.getPosition().y < -15) {
        this.entity.destroy();
    };
};

FallingPlatform.prototype.onCollisionStart = function (result) {
    var otherEntity = result.other;
    if (this.entity.tags.has('falling_platform') && !otherEntity.tags.has('player')) {
        setTimeout(() => {
            // 화살표 함수를 사용하여 this의 컨텍스트를 유지합니다.
            this.entity.destroy();
        }, 10000); // 10초 후에 실행
    }
};