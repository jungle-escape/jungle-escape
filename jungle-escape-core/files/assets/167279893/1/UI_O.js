var UiO = pc.createScript('uiO');

// initialize code called once per entity
UiO.prototype.initialize = function() {
    this.entity.setEulerAngles(0, 40, 0);
    this.disableTimer = 0;
};

// update code called every frame
UiO.prototype.update = function(dt) {
    if (this.entity.enabled) {
        this.disableTimer += dt;

        if (this.disableTimer <= 1) {
            this.entity.rotate(0, 60, 0);
        } else {
            this.entity.setEulerAngles(0, 40, 0);
        }

        if (this.disableTimer >= 2) {
            this.disableTimer = 0;
            this.entity.enabled = false;
        }
    }
};