var MovementPropeller = pc.createScript("movementPropeller");

MovementPropeller.prototype.initialize = function () {
  this.previousTime = Date.now(); // 이전 프레임 시간 설정
};

MovementPropeller.prototype.swap = function (old) {
  this.previousTime = old.previousTime;
};

// update code called every frame
MovementPropeller.prototype.update = function (dt) {
  // 현재 시간 가져오기
  var currentTime = Date.now();

  // 이전 프레임과 현재 프레임 사이의 시간 차이 계산
  var deltaTime = currentTime - this.previousTime;
  this.previousTime = currentTime; // 현재 시간을 이전 시간으로 설정

  // 회전 속도 정의
  var rotationSpeed = 360 / 1000; // 1000ms 동안 360도 회전

  // 경과 시간을 사용하여 이번 프레임에서 회전할 각도 계산
  var angle = rotationSpeed * deltaTime;

  this.entity.rotate(0, angle, 0);
};
