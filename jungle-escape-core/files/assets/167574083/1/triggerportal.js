var Triggerportal = pc.createScript('triggerportal');

Triggerportal.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.portal = this.entity.findByName('portal');
};

Triggerportal.prototype.onTriggerEnter = function (target) {
    if (target.tags.has('player')) {
        this.portal.script.effekseerEmitter.play();
        CAMERA.endPoint = true;
    }
}