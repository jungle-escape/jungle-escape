var LeaveButton = pc.createScript('leaveButton');

LeaveButton.prototype.initialize = function () {
    this.entity.element.on('click', () => {
        // BGM off temp fix
        const bgm = this.app.root.findByName('BGM');
        // bgm 엔티티의 모든 사운드를 정지
        if (bgm && bgm.sound) {
            bgm.sound.stop();
        }

        pn.leaveRoom();
    });
};
