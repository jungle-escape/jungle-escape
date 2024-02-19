var HelloWorld = pc.createScript('helloWorld');

HelloWorld.prototype.initialize = function () {
    HELLOWORLD = this;
};


HelloWorld.prototype.boom = function () {
    this.entity.children.forEach((child1) => {
        child1.children.forEach((child2) => {
            child2.children.forEach((child3) => {
                if (child3.tags.has("falling_platform")) {
                    child3.rigidbody.type = pc.BODYTYPE_DYNAMIC;

                    var force = new pc.Vec3(-50, 0, -50); // Y축 방향으로 10의 힘
                    var position = child3.getPosition(); // 힘을 적용할 위치

                    child3.rigidbody.applyForce(force, position);
                    setTimeout(() => {
                        // 화살표 함수를 사용하여 this의 컨텍스트를 유지합니다.
                        child3.enabled = false;
                    }, 3000); // 10초 후에 실행
                }
            });
        });
    });
};