var Firework = pc.createScript('firework');

// initialize code called once per entity
Firework.prototype.initialize = function() {

};

// update code called every frame
Firework.prototype.update = function(dt) {
    if (this.app.keyboard.wasPressed(pc.KEY_0)) {
        this.entity.script.effekseerEmitter.play();
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Firework.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/