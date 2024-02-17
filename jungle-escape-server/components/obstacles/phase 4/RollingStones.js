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
    this.app.on('_player:arrived', () => {
        this.interval = setInterval(() => {
            this.onDynamic();
        }, 5000);
    }, this);
    this.once('destroy', () => {
        clearInterval(this.interval);
    });
    this._stones = this.stones.map(t => t.template.resource);
}

RollingStones.prototype.onDynamic = function () {
    const stone = this._stones[Math.floor(Math.random() * this._stones.length)];
    const entity = stone.instantiate(this.app);
    entity.enabled = true;
    this.entity.addChild(entity);
}