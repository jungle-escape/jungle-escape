var MallocBlock = pc.createScript('mallocBlock');

// initialize code called once per entity
MallocBlock.prototype.initialize = function () {

    console.log("MallocBlock Object.keys(this.entity)", Object.keys(this.entity), this.entity.children, Object.keys(this.entity.children))

    this.entity.collision.on('collisionstart', this.onCollisionStart, this);

};


MallocBlock.prototype.onCollisionStart = function (hit) {

}

// swap method called for script hot-reloading
// inherit your script state here
// MallocBlock.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/