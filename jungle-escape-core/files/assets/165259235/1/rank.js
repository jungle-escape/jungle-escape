var Rank = pc.createScript('rank');

Rank.prototype.initialize = function () {
    RANK = this;
    // this.entity.element.text = 'RANK';
    this.entity.element.text = '';
};

// update code called every frame
Rank.prototype.addText = function (text) {
    this.entity.element.text = text + '\n';
};