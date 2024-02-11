var GameRbtreeMsg = pc.createScript('gameRbtreeMsg');

// initialize code called once per entity
GameRbtreeMsg.prototype.initialize = function () {
    GameRbtreeMsg = this;
    this.entity.element.text = '';

    //this.app.on('obeyRBtreeRules', this.addText, this);
    //    console.log("GameRbtreeMsg", this.app)
    //   this.app.on('obeyRBtreeRules', function (msg) {
    //      console.log("msg?")
    //   })

};

// update code called every frame
this.addText = function (text) {

    console.log("app.fire and app.on succ")


    if (text === 'No double Reds') {
        this.entity.element.text = text + '\n빨간색 노드가 연속으로 나올 수 없습니다.';
        setTimeout(() => {
            this.entity.element.text = ''
        }, 2000);
    }

};

// swap method called for script hot-reloading
// inherit your script state here
// GameRbtreeMsg.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// https://developer.playcanvas.com/en/user-manual/scripting/