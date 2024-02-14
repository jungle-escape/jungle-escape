var Effecttest = pc.createScript('effecttest');

// initialize code called once per entity
Effecttest.prototype.initialize = function() {

};

// update code called every frame
Effecttest.prototype.update = function(dt) {
    if (this.app.keyboard.wasPressed(pc.KEY_2)) {
        this.entity.script.effekseerEmitter.play();
    }
};

// swap method called for script hot-reloading
// inherit your script state here
// Effecttest.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/