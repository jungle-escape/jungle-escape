var ProgressBar = pc.createScript('progressBar');

// initialize code called once per entity
ProgressBar.prototype.initialize = function() {
    PROGRESSBAR = this;
};

// 이미지 엘리먼트의 색상을 검정색으로 설정하는 함수
ProgressBar.prototype.changeColor = function(num) {
    // var imageElement = this.entity.element; // 이 스크립트가 부착된 엔티티의 이미지 엘리먼트를 가져옵니다.
    // imageElement.color = new pc.Color(0, 0, 0, 1); // 색상을 검정색으로 변경합니다.
    // imageElement.color = new pc.Color(1, 1, 1, 1);
    var imageElement = this.entity.findByName(`progressBar${num}`);
    var runner = this.entity.findByName(`runner${num}`);
    var nextRunner = this.entity.findByName(`runner${num + 1}`);

    imageElement.element.color = new pc.Color(0, 0, 0, 1);
    runner.enabled = false;
    nextRunner.enabled = true;

    // runner.element.opacity = 0.5;

    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(0, 0, 0, 1);
    // }, 300);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(1, 1, 1, 1);
    // }, 600);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(0, 0, 0, 1);
    // }, 900);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(1, 1, 1, 1);
    // }, 1200);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(0, 0, 0, 1);
    // }, 1500);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(1, 1, 1, 1);
    // }, 1800);
    // setTimeout(() => {
    //     imageElement.element.color = new pc.Color(0, 0, 0, 1);
    //     runner.enabled = false;
    //     nextRunner.enabled = true;
    // }, 2100);
};
