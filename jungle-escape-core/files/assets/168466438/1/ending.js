var Ending = pc.createScript('ending');

// initialize code called once per entity
Ending.prototype.initialize = function() {
    pn.on('ending', () => {
        this.endingSound();
    })
};


Ending.prototype.endingSound = function() {
    const bgm = this.app.root.findByName('BGM');
    if (bgm.sound.slot('BGM2').isPlaying) {
        bgm.sound.stop('BGM2');
    }
    if (!bgm.sound.slot('BGM3').isPlaying) {
        bgm.sound.play('BGM3');
    }
};
