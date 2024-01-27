var Log = pc.createScript('log');

Log.prototype.initialize = function () {
    LOG = this;
    this.entity.element.text = '';
};

// update code called every frame
Log.prototype.addText = function (text) {
    this.entity.element.text += text + '\n';
};
