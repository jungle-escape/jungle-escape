var StartLog = pc.createScript('startlog');

StartLog.prototype.initialize = function () {
    STARTLOG = this;
    this.entity.element.text = '';
};

// update code called every frame
StartLog.prototype.addText = function (text) {
    if (text === 'START!!') {
        this.entity.element.text = text;

        // Enable hello world stage light, play boom sound
        // Finding stage light need to be fixed... too brutal?
        const level = this.app.root.findByName('Level');
        const p1 = level?.findByName('P1. Hello World');
        const stageLight = p1?.findByName('StageLight');
        if (stageLight) {
            stageLight.enabled = true;
        }
        if (!p1.sound.slot('boom').isPlaying) {
            p1.sound.play('boom');
        }
        const bgm = this.app.root.findByName('BGM');
        if (bgm.sound.slot('BGM1').isPlaying) {
            bgm.sound.stop('BGM1');
        }
        if (!bgm.sound.slot('BGM2').isPlaying) {
            bgm.sound.play('BGM2');
        }

        setTimeout(() => {
            this.entity.element.text = '';
        }, 2000);
    } else {

        // 2/6 잠시 날려두겠습니다(이병재)
        // this.entity.element.text = '잠시후 게임이 시작됩니다' + '\n' + text;
        this.entity.element.text = text;

    }

};