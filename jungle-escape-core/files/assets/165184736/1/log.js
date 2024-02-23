var Log = pc.createScript('log');

Log.prototype.initialize = function () {
    LOG = this;
    this.entity.element.text = '';
    this.textLines = []; // 텍스트 라인을 저장하는 배열
    this.maxLines = 3; // 최대 텍스트 라인 수
};

Log.prototype.addText = function (text) {
    // // 새로운 텍스트 라인 추가
    // this.textLines.push(text);

    // // 텍스트 라인이 최대 수를 초과하면, 가장 오래된 라인 제거
    // while (this.textLines.length > this.maxLines) {
    //     this.textLines.shift(); 
    // }

    // // 화면에 텍스트 업데이트
    // this.updateText();

    // setTimeout(() => {
    //     this.textLines.shift(); // 가장 오래된 텍스트 라인 제거
    //     this.updateText(); // 화면에 텍스트 업데이트
    // }, 3000);
};

// 화면에 텍스트를 업데이트하는 함수
Log.prototype.updateText = function () {
    // if (this.entity && this.entity.element) {
    //     if (this.textLines && this.textLines.length > 0) {
    //         this.entity.element.text = this.textLines.join('\n');
    //     } else {
    //         this.entity.element.text = '';
    //     }
    // }
};
