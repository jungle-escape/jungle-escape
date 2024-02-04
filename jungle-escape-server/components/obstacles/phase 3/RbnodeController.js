var RbnodeController = pc.createScript('rbnodeController');

RbnodeController.prototype.initialize = function() {
    this.app.on('rbnode:raiseColumn', (event) => { this.raiseColumn(event); });
    this.app.on('rbnode:lowerColumn', (event) => { this.lowerColumn(event); });
};

RbnodeController.prototype.raiseColumn = function (event) {
    const { column, speed, height } = event;
    if (!column) return;

    console.debug("RbnodeController:raiseColumn");
    this.app
        .tween(column.getLocalPosition())
        .to(new pc.Vec3(0, height, 0), speed, pc.SineOut)
        .loop(false)
        .yoyo(false)
        .start();

}

RbnodeController.prototype.lowerColumn = function (event) {
    const { column, speed, height } = event;
    if (!column) return;

    console.debug("RbnodeController:lowerColumn");
    this.app
        .tween(column.getLocalPosition())
        .to(new pc.Vec3(0, height, 0), speed, pc.SineOut)
        .loop(false)
        .yoyo(false)
        .start();
}