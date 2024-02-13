var RollingStones = pc.createScript('rollingStones');

RollingStones.attributes.add('stones', {
    title: 'Stone templates',
    type: 'json',
    array: true,
    description: 'Templates supposed to work as Network Entity',
    schema: [{
        type: 'asset',
        assetType: 'template',
        name: 'template'
    }]
});

RollingStones.prototype.initialize = function () {
    this.time = 0;
    this._stones = this.stones.map(t => t.template.resource);
    this.app.on('_networkEntities:dynamicCreate', this.onDynamic, this);
    this.app.fire('_networkEntities:dynamicCreate');
}

RollingStones.prototype.update = function (dt) {
    // this.time += dt;
    // if (this.time > 5) {
    //     this.time = 0;
    //     this.app.fire('_networkEntities:dynamicCreate');
    // }
}

RollingStones.prototype.onDynamic = function () {
    const stone = this._stones[Math.floor(Math.random() * this._stones.length)];
    const entity = stone.instantiate(this.app);
    this.entity.addChild(entity);
}