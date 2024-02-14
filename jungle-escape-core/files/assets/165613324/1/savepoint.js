var Savepoint = pc.createScript('savepoint');

// initialize code called once per entity
Savepoint.prototype.initialize = function () {
    this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
    this.isBackView = false;
};

Savepoint.prototype.onTriggerEnter = function (target) {
    // Set player savepoint
    var pos = this.entity.getPosition();
    if (target.name === ME.name) {

        if (PHASE1.arrived === false) {
            this.faded(PHASE1, PROGRESSBAR, 1);
            // CAMERA.switchView(CAMERA);
        } else if (PHASE2.arrived === false && pos.z <= -300) {
            this.faded(PHASE2, PROGRESSBAR, 2);
            // CAMERA.switchView(CAMERA);
        } else if (PHASE3.arrived === false && pos.z <= -700) {
            this.faded(PHASE3, PROGRESSBAR, 3);
            // CAMERA.switchView(CAMERA);
        }
    };


    // Turn on stage light
    const stageLight = this.entity.parent.findByName('StageLight');
    if (stageLight && !stageLight.enabled) {
        stageLight.enabled = true;
    }

    // Turn on proper BGM with savepoint name
    const bgm = this.app.root.findByName('BGM');
    const pointName = this.entity.name;
    var bgmName = '';
    if (pointName === 'savepoint1') {
        bgmName = 'BGM1';
    } else if (pointName === 'savepoint2') {
        bgmName = 'BGM2';
    } else {
        bgmName = 'BGM2';
    }

    // Stop all sound slot, except 'bgmName'
    var slots = bgm.sound.slots;
    if (slots) {
        for (var slotName in slots) {
            var slot = slots[slotName];
            if (slotName === bgmName) {
                if (!slot.isPlaying) {
                    bgm.sound.play(bgmName);
                }
                continue;
            }
            slot.stop();
        }
    }
}

Savepoint.prototype.faded = function (phase, progressbar, num) {

    phase.arrived = true;
    phase.enable();

    // 시작 투명도
    var opacity = 1;
    // 3초 동안 감소할 투명도 값
    var decrement = 5 / 20 / 3; // 가정: 60fps, 3초 동안


    // var balloon = phase.entity.findByName('Balloon');
    var text = phase.entity.findByName('Text');
    var image = phase.entity.findByName('Image');


    var intervalId = setInterval(function () {
        if (!text || !text.element || !image || !image.element || !phase) {
            clearInterval(intervalId); // 유효하지 않은 경우 인터벌 취소
            return; // 함수 실행 중단
        };


        opacity -= decrement;
        //  balloon.element.opacity = opacity;
        text.element.opacity = opacity;
        image.element.opacity = opacity;
        // image.element.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(intervalId);
            phase.disable();
            // phaseimg.disable();
        }
    }, 1000 / 20); // 60fps로 갱신
};

// setTimeout(() => {
//     PHASE1.disable();
//     PHASE1IMG.disable();
// }, 3000);


// // for 3d asset
// Savepoint.prototype.fadeAssets = function (iconEntity, targetOpacity) {


//     // 'render' 컴포넌트의 'meshInstances'를 순회
//     if (iconEntity.render && iconEntity.render.meshInstances) {
//         iconEntity.render.meshInstances.forEach(function (meshInstance) {
//             var material = meshInstance.material;

//             // 투명도 설정
//             material.opacity = targetOpacity;

//             // 머티리얼이 투명도를 올바르게 처리하도록 blendType 설정
//             if (targetOpacity < 1) {
//                 material.blendType = pc.BLEND_NORMAL;
//             } else {
//                 // 머티리얼이 완전 불투명한 경우, 필요에 따라 blendType을 변경할 수 있습니다.
//                 material.blendType = pc.BLEND_NONE;
//             }

//             // 머티리얼 변경 사항 적용
//             material.update();
//         });
//     }
// }