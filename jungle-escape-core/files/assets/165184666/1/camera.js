var Camera = pc.createScript('camera');

// Camera.attributes.add('ofs', { type: "vec3", default: [0, 0, 0]});
// Camera.attributes.add('rot', { type: "vec3", default: [-45, 0, 0]});
Camera.attributes.add('ofs', { type: "vec3", default: [60, 60, 60]}); // 왼쪽 위 오프셋
Camera.attributes.add('rot', { type: "vec3", default: [0, 0, 0]}); // 수정된 초기 회전 값
Camera.attributes.add('backViewOfs', { type: "vec3", default: [0, 0, 40]}); // 뒤쪽 뷰 오프셋

Camera.prototype.initialize = function () {
    this.isBackView = false; // 현재 뷰 상태
    this.originalRotation = null; // 카메라의 원래 회전을 저장할 변수
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    CAMERA = this;
    this.isMoving = false;
    this.time = 0;

    // 현재 관전 중인 플레이어의 인덱스
    // this.currentPlayerIndex = 0;
    // 모든 플레이어를 저장할 배열
    // this.players = [];

    // 엔드포인트 진입 여부
    this.endPoint = false;
};

Camera.prototype.update = function (dt) {
    // 엔드포인트 진입시 카메라 팔로우를 멈춥니다
    if (this.endPoint) {
        return;
    }

    if (!this.myPlayer) {
        this.findMyPlayer();
    }

    if (this.myPlayer) {
        var targetPos = this.myPlayer.getPosition();

        // console.log(this.entity.getRotation());
        var backViewPoint = targetPos.clone().add(this.backViewOfs);
        var quarterViewPoint = targetPos.clone().add(this.ofs);
        var quarterViewRot = new pc.Quat(-0.27984814887095943, 0.3647052007993578, 0.11591690325292761, 0.8804762363964862);
        var backViewRot = new pc.Quat(0, 0, 0, 1);

        if (this.isBackView) {
            if (!this.isMoving) {
                this.entity.setPosition(backViewPoint);
                this.entity.setRotation(backViewRot);
                // this.entity.lookAt(targetPos);
            } else {
                this.time += dt;   
                this.time = pc.math.clamp(this.time, 0, 1);
                var percent = this.time / 1;

                var angle = this.entity.getRotation();
                var position = this.entity.getPosition();
                angle.slerp(quarterViewRot, backViewRot, percent);
                position.lerp(quarterViewPoint, backViewPoint, percent);

                this.entity.setRotation(angle);
                this.entity.setPosition(position);

                if (this.time === 1) {
                    this.time = 0;
                    this.isMoving = false;
                }  
            }
        } else {
            if (!this.isMoving) {
                this.entity.setPosition(quarterViewPoint);
                this.entity.setRotation(quarterViewRot);
                // this.entity.lookAt(targetPos);
            } else {
                this.time += dt; 
                this.time = pc.math.clamp(this.time, 0, 1);
                var percent = this.time / 1;

                var angle = this.entity.getRotation();
                var position = this.entity.getPosition();
                angle.slerp(backViewRot, quarterViewRot, percent);
                position.lerp(backViewPoint, quarterViewPoint, percent);

                this.entity.setRotation(angle);
                this.entity.setPosition(position);

                if (this.time === 1) {
                    this.time = 0;
                    this.isMoving = false;
                }  
            }
            // 원래 회전으로 복원
            // if (this.originalRotation) {
            //     this.entity.setRotation(this.originalRotation);
            // }
        }
    }
};

Camera.prototype.onKeyDown = function (event) {
    // L 키가 눌렸을 때 뷰 전환
    if (event.key === pc.KEY_L) {
        this.switchView();
    }

    // N 키가 눌렸을 때 다음 플레이어로 전환
    // if (event.key === pc.KEY_N) {
    //     this.switchPlayer();
    // }
};

Camera.prototype.switchView = function () {
    // if (!sth.isBackView) {
    //     // 처음 L 키를 누를 때 현재 회전을 저장
    //     sth.originalRotation = sth.entity.getRotation().clone();
    // }

    this.isBackView = !this.isBackView; // 뷰 상태 전환
    this.isMoving = true;
};

Camera.prototype.findMyPlayer = function () {
    this.players = this.app.root.findByTag('player');
    for (var i = 0; i < this.players.length; i++) {
        var player = this.players[i];
        if (player.networkEntity && player.networkEntity.mine) {
            this.myPlayer = player;
            break;
        }
    }
}

// Camera.prototype.switchPlayer = function () {
//     this.findMyPlayer();
//     if (this.players.length > 1) {
//         현재 플레이어 인덱스를 업데이트
//         this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
//         새로운 관전 대상을 myPlayer로 설정
//         this.myPlayer = this.players[this.currentPlayerIndex];
//     }
// };