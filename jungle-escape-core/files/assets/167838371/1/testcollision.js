var Testcollision = pc.createScript('testcollision');

// initialize code called once per entity
Testcollision.prototype.initialize = function() {
    this.entity.collision.on("contact", this.onContact, this);
};

Testcollision.prototype.onContact = function (hit) {
    if (hit.other.tags.has('player')) {
        console.log("hi you are player!");
    }
}

// swap method called for script hot-reloading
// inherit your script state here
// Testcollision.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/