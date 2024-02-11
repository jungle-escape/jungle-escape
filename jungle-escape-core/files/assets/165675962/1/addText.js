var AddText = pc.createScript('addText');
// Add attributes for speed and range
AddText.attributes.add("text", {
    type: "string",
    default: '',
    title: "Input Text",
});

// initialize code called once per entity
AddText.prototype.initialize = function () {

    this.text = 'null'

    // 새 Canvas를 생성하고 텍스트를 렌더링합니다.
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = 512; // 텍스처 크기 조정 가능
    canvas.height = 512; // 텍스처 크기 조정 가능

    // 캔버스에 텍스트를 그립니다.
    context.fillStyle = '#FFFFFF'; // 배경색 설정
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(this.text, canvas.width / 2, canvas.height / 2);

    // 캔버스에서 텍스처를 생성합니다.
    var texture = new pc.Texture(this.app.graphicsDevice, {
        width: canvas.width,
        height: canvas.height
    });
    texture.setSource(canvas);

    // 텍스처를 사용하는 재질을 생성합니다.
    var material = new pc.StandardMaterial();
    material.diffuseMap = texture;
    material.update();

    // 현재 엔티티의 메쉬 인스턴스에 재질을 적용합니다.
    this.entity.model.material = material;

};

// update code called every frame
AddText.prototype.update = function (dt) {

};

// swap method called for script hot-reloading
// inherit your script state here
// AddText.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/