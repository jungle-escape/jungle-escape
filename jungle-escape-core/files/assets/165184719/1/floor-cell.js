var FloorCell = pc.createScript('floorCell');

FloorCell.attributes.add('tags', { type: 'string', array: true, description: 'Only entities with this tags can trigger this floor button' });
FloorCell.attributes.add('color', { type: 'rgb' });

FloorCell.prototype.initialize = function () {
    this.colorData = new Float32Array([this.color.r, this.color.g, this.color.b]);
    this.on('attr:color', this.onColor);
};

FloorCell.prototype.swap = function (old) {
    this.colorData = old.colorData;
    old.off('attr:color', old.onColor);
    this.on('attr:color', this.onColor);
};

FloorCell.prototype.onColor = function () {
    if (this.colorData[0] === this.color.r && this.colorData[1] === this.color.g && this.colorData[2] === this.color.b)
        return;

    this.colorData[0] = this.color.r;
    this.colorData[1] = this.color.g;
    this.colorData[2] = this.color.b;
    this.entity.render.meshInstances[0].setParameter('material_diffuse', this.colorData);
};
