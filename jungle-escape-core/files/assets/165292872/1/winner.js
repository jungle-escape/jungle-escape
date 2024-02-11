var Winner = pc.createScript('winner');

Winner.prototype.initialize = function () {
    WINNER = this;
    this.entity.element.text = '';
};

// update code called every frame
Winner.prototype.addText = function (text) {
    this.entity.element.text = text + '\n';
};