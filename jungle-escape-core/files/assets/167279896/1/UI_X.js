var UiX = pc.createScript('uiX');

// initialize code called once per entity
UiX.prototype.initialize = function() {
    this.entity.setEulerAngles(0, 40, 0);
    this.disableTimer = 0;
    this.playerEntity = this.entity.parent;
};

// update code called every frame
UiX.prototype.update = function(dt) {
    if (this.entity.enabled) {
        if (this.playerEntity.pcReactOn) {
            return;
        }
        var valY = CAMERA.isBackView? 0 : 40;

        this.entity.setEulerAngles(0, valY, 0);

        this.disableTimer += dt;

        if (this.disableTimer >= 2) {
            this.disableTimer = 0;
            this.entity.enabled = false;
        }
    }
};