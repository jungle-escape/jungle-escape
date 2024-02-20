var RollingStones = pc.createScript('rollingStones');

RollingStones.attributes.add('interval', {
    type: 'number',
    enum: [
        { 'slow': 5 },
        { 'standard': 3 },
        { 'fast': 2 },
        { 'super fast': 1 }
    ],
    default: 3
});
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
    this.app.rollingStones = this;
}