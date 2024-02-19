var Disabletrigger = pc.createScript('disabletrigger');

// initialize code called once per entity
Disabletrigger.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

Disabletrigger.prototype.onTriggerEnter = function (target) {
    if (target.tags.has('player')) {
        const modelEntity = target.children[0];
        const tag = target.children[1];

        const gold = target.findByName('gold');
        const silver = target.findByName('silver');
        const bronze = target.findByName('bronze');

        [modelEntity, tag, gold, silver, bronze].forEach(item => {
        if (item) {
            item.enabled = false;
        }
        });

        target.script.playerController.endPoint = false;
        target.rigidbody.linearVelocity = new pc.Vec3(0,0,0);
        target.sound.play("warp");
    }
}


// swap method called for script hot-reloading
// inherit your script state here
// Disabletrigger.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/