var TriggerTurnOnOff = pc.createScript('triggerTurnOnOff');

TriggerTurnOnOff.attributes.add('offs', {
    type: 'entity',
    array: true
});
TriggerTurnOnOff.attributes.add('ons', {
    type: 'entity',
    array: true
});

TriggerTurnOnOff.prototype.initialize = function() {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
};

TriggerTurnOnOff.prototype.onTriggerEnter = function(target) {
    if (target.tags.has('player')) {
        this.entity.collision.off('triggerenter', this.onTriggerEnter, this);
        this.offs.forEach(e => {if (e) e.enabled = false; });
        this.ons.forEach(e => {if (e) e.enabled = true; });
    }
};