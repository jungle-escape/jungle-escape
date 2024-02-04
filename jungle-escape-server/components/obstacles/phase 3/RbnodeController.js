var RbnodeController = pc.createScript('rbnodeController');

RbnodeController.prototype.initialize = function() {
    this.app.on('rbnode:raiseColumn', (event) => { this.raiseColumn(event); });
    this.app.on('rbnode:lowerColumn', (event) => { this.lowerColumn(event); });
};

RbnodeController.prototype.raiseColumn = function (event) {
    const { column, speed, height } = event;
    if (!column) return;


}

RbnodeController.prototype.lowerColumn = function (event) {
    const { column, speed, height } = event;
    if (!column) return;

    
}