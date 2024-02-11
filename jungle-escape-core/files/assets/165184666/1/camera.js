var Camera = pc.createScript('camera');

// Camera.attributes.add('ofs', { type: "vec3", default: [0, 0, 0]});
// Camera.attributes.add('rot', { type: "vec3", default: [-45, 0, 0]});
Camera.attributes.add('ofs', { type: "vec3", default: [-10, 5, 0]}); // 왼쪽 위 오프셋
Camera.attributes.add('rot', { type: "vec3", default: [-30, 45, 0]}); // 수정된 초기 회전 값
Camera.attributes.add('backViewOfs', { type: "vec3", default: [0, 0, 10]}); // 뒤쪽 뷰 오프셋

Camera.prototype.initialize = function () {
    this.isBackView = false; // 현재 뷰 상태
    this.originalRotation = null; // 카메라의 원래 회전을 저장할 변수
    this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
    CAMERA = this;
};

Camera.prototype.update = function (dt) {
    if (!this.myPlayer) {
        this.findMyPlayer();
    }

    if (this.myPlayer) {
        var targetPos = this.myPlayer.getPosition();

        var newPos;

        if (this.isBackView) {
            newPos = targetPos.clone().add(new pc.Vec3(this.backViewOfs.x, this.backViewOfs.y, this.backViewOfs.z));
            this.entity.setPosition(newPos);
            this.entity.lookAt(targetPos);
        } else {
            newPos = targetPos.clone().add(this.ofs);
            this.entity.setPosition(newPos);
            this.entity.setEulerAngles(this.rot.x, this.rot.y, this.rot.z);
            this.entity.lookAt(targetPos);
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
        this.switchView(this);
    }
};

Camera.prototype.switchView = function (sth) {
    // if (!sth.isBackView) {
    //     // 처음 L 키를 누를 때 현재 회전을 저장
    //     sth.originalRotation = sth.entity.getRotation().clone();
    // }

    sth.isBackView = !sth.isBackView; // 뷰 상태 전환
};

Camera.prototype.findMyPlayer = function () {
    var players = this.app.root.findByTag('player');
    for (var i = 0; i < players.length; i++) {
        var player = players[i];
        if (player.networkEntity && player.networkEntity.mine) {
            this.myPlayer = player;
            break;
        }
    }
}
