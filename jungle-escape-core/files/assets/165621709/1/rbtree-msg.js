var RbtreeMsg = pc.createScript('rbtreeMsg');

// initialize code called once per entity
RbtreeMsg.prototype.initialize = function () {

    RbtreeMsg = this;
    this.entity.element.text = ''

    this.app.on('rbtreeMsg', this.updateMsg, this)
};

// update code called every frame
RbtreeMsg.prototype.updateMsg = function (textFromRBtree) {

    if (textFromRBtree == 'No Double Red Nodes') {
        setTimeout(() => {
            this.entity.element.text = text + '\n빨간색 노드는 연속으로 나올 수 없습니다.';
        }, 2000);
    }



};
