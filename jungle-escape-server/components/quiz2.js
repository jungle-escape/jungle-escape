var Quiz2 = pc.createScript('quiz2');

// Quiz 객체가 생성될 때 실행되는 함수
Quiz2.prototype.initialize = function () {
    this.currentDirection = 1;
    this.moveAmount = 15; // 각 방향으로 이동할 거리
};

Quiz2.prototype.swap = function (old) {
    this.currentDirection = old.currentDirection;
    this.moveAmount = old.moveAmount;
}

// 매 프레임마다 실행되는 업데이트 함수
Quiz2.prototype.update = function (dt) {
    // 현재 방향에 따라 이동
    switch (this.currentDirection) {
        case 0: // 앞으로 이동
            this.entity.translateLocal(this.moveAmount * dt, 0, 0);
            break;
        case 1: // 뒤로 이동
            this.entity.translateLocal(-this.moveAmount * dt, 0, 0);
            break;
    }

    var currentPosition = this.entity.getPosition();
    // 지정된 거리만큼 이동했는지 확인
    if (this.currentDirection === 0 && currentPosition.z >= -80) {
        // 다음 방향으로 전환
        this.entity.setLocalPosition(120, -100, 0);
        this.currentDirection = 1;
    } else if (this.currentDirection === 1 && currentPosition.z <= -320) {
        // 다음 방향으로 전환
        this.entity.setLocalPosition(-120, 0, 0);
        this.currentDirection = 0;
    }
};