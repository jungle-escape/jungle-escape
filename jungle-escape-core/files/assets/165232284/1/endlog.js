var EndLog = pc.createScript('endlog');

EndLog.prototype.initialize = function () {
    ENDLOG = this;
    this.entity.element.text = '';
};

// update code called every frame
EndLog.prototype.addText = function (text) {
    this.entity.element.text = text + '\n';
};