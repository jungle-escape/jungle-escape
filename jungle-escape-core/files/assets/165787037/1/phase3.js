var Phase3 = pc.createScript('phase3');

// initialize code called once per entity
Phase3.prototype.initialize = function() {
    PHASE3 = this;
    PHASE3.arrived = false;
    this.entity.enabled = false;
};

// update code called every frame
Phase3.prototype.enable = function() {
    this.entity.enabled = true;
};

Phase3.prototype.disable = function() {
    this.entity.enabled = false;
};
