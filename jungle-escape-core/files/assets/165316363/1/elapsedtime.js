var Elapsedtime = pc.createScript('elapsedtime');

Elapsedtime.prototype.initialize = function () {
    ELAPSEDTIME = this;
    this.entity.element.text = '';
};

// update code called every frame
Elapsedtime.prototype.addText = function (text) {
    this.entity.element.text = text + '\n';
};