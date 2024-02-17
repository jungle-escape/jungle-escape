var PropellerWings = pc.createScript("propellerWings");

// initialize code called once per entity
PropellerWings.prototype.initialize = function () {
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};

PropellerWings.prototype.swap = function (old) {
  this.entity.collision.on("collisionstart", this.onCollisionStart, this);
};

// update code called every frame
PropellerWings.prototype.update = function (dt) {};

// 충돌 이벤트 핸들러
PropellerWings.prototype.onCollisionStart = function (event) {
  var otherEntity = event.other;

  var forceDirection = new pc.Vec3(12, 12, 0);

  forceDirection.normalize(); // 방향 벡터 정규화

  // 힘의 크기를 정의
  var forceMagnitude = 300000;

  // 최종 힘 벡터
  var force = forceDirection.scale(forceMagnitude);

  if (otherEntity.rigidbody) {
    otherEntity.rigidbody.applyForce(force.x, force.y, force.z);
  }
};
