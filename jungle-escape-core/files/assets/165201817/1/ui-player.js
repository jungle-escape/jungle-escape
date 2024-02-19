var UiPlayer = pc.createScript('uiPlayer');

// initialize code called once per entity
UiPlayer.prototype.initialize = function() {
    var playerEntity = this.entity.parent;
    
    this.entity.element.text = playerEntity.name;

    if (playerEntity.networkEntity.mine) {
        this.entity.element.color = new pc.Color(0, 0.8392156862745098, 0.47843137254901963);
    }
    
};

UiPlayer.prototype.update = function() {
    // Adjust name tag angle
    var valY = CAMERA.isBackView? 0 : 40;

    this.entity.setEulerAngles(0, valY, 0);
}