var LeaveButton = pc.createScript('leaveButton');

LeaveButton.prototype.initialize = function () {
    this.entity.element.on('click', () => {
        // BGM off temp fix
        const bgm = this.app.root.findByName('BGM');
        // bgm 엔티티의 모든 사운드를 정지
        if (bgm && bgm.sound) {
            bgm.sound.stop();
        }

        //pn.leaveRoom();
        pn.leaveRoom()
            .then(() => {
                // 방을 성공적으로 떠난 후의 처리
                console.log("Room left successfully");
            })
            .catch((error) => {
                // 오류 처리
                console.error("Failed to leave room:", error);
            });
    });
};
