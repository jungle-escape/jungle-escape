var Phase1 = pc.createScript('phase1');

// initialize code called once per entity
Phase1.prototype.initialize = function() {
    PHASE1 = this;
    PHASE1.arrived = false;
    this.entity.enabled = false;
};

// update code called every frame
Phase1.prototype.enable = function() {
    this.entity.enabled = true;
};

Phase1.prototype.disable = function() {
    this.entity.enabled = false;
};
