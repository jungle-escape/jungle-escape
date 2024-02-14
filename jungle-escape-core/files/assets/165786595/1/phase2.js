var Phase2 = pc.createScript('phase2');

// initialize code called once per entity
Phase2.prototype.initialize = function() {
    PHASE2 = this;
    PHASE2.arrived = false;
    this.entity.enabled = false;
};

// update code called every frame
Phase2.prototype.enable = function() {
    this.entity.enabled = true;
};

Phase2.prototype.disable = function() {
    this.entity.enabled = false;
};
