var FloorText = pc.createScript('floorText');

// initialize code called once per entity
FloorText.prototype.initialize = function () {

    // this.isTextShow = this.entity.parent.isTextShow
    this.isTextShow = this.entity.parent.script.floorCell.__attributes.isTextShow


};