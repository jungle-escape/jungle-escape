var EndLog = pc.createScript('endlog');

EndLog.prototype.initialize = function () {
    ENDLOG = this;
    this.entity.element.text = '';
    pn.on('winner', (num) => {
        this.plyaSound();
    })
};

// update code called every frame
EndLog.prototype.addText = function (text) {
    this.entity.element.text = text + '\n';
};

EndLog.prototype.plyaSound = function () {
    const bgm = this.app.root.findByName('BGM');
    if (!bgm.sound.slot('endsound').isPlaying) {
        bgm.sound.play('endsound');
    }
};