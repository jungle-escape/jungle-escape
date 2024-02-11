var Phase13d = pc.createScript('phase13d');


// initialize code called once per entity
Phase13d.prototype.initialize = function() {
    Phase13d = this;
    Phase13d.arrived = false;
    this.entity.enabled = false;
};

// update code called every frame
Phase13d.prototype.enable = function() {
    this.entity.enabled = true;
};

Phase13d.prototype.disable = function() {
    this.entity.enabled = false;
};
