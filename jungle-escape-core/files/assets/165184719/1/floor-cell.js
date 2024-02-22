var FloorCell = pc.createScript('floorCell');

FloorCell.attributes.add('triggerEntity', { type: 'entity' });
FloorCell.attributes.add('tags', { type: 'string', array: true, description: 'Only entities with this tags can trigger this floor button' });
FloorCell.attributes.add('color', { type: 'rgb' });
FloorCell.attributes.add('isTextShow', { type: 'boolean', default: false });
FloorCell.attributes.add('isRightBox', { type: 'boolean', default: false });
FloorCell.attributes.add("attacker", {
    type: "entity",
    title: "Attacker Entity",
    description: "The attacker block will be set",
});



FloorCell.prototype.initialize = function () {
    this.colorData = new Float32Array([this.color.r, this.color.g, this.color.b]);
    this.on('attr:color', this.onColor)

    this.originState = this.isTextShow
    this.on('attr:isTextShow', this.onShowText)

    ////fire를 서버로 옮기기 위한 술수
    // //this.originState = this.isActive
    // this.originActiveState = this.isActive
    // this.on('attr:isActive', this.onTriggerActive)

    ////fire를 서버로 옮기기 위한 술수
    // fire의 active 끄고 켜는 버튼
    // this.active = false

    // console.log("this.isAcitve? / init", this.isActive)

    this.timer = 0
};

FloorCell.prototype.swap = function (old) {
    this.colorData = old.colorData;
    old.off('attr:color', old.onColor);
    this.on('attr:color', this.onColor);


    this.originState = old.originState;

    old.off('attr:isTextShow', old.onShowText);
    this.on('attr:isTextShow', this.onShowText);
};

FloorCell.prototype.onColor = function () {

    if (this.colorData[0] === this.color.r && this.colorData[1] === this.color.g && this.colorData[2] === this.color.b)
        return;

    this.colorData[0] = this.color.r;
    this.colorData[1] = this.color.g;
    this.colorData[2] = this.color.b;
    this.entity.render.meshInstances[0].setParameter('material_diffuse', this.colorData);
};


FloorCell.prototype.onShowText = function () {


    if (this.isRightBox) { //정답 박스일 경우 변경이 없다. 
        return;
    }

    if (this.isTextShow) {
        this.entity.children[0].enabled = true;
        //  this.entity.children[1].enabled = true;



    }

};
