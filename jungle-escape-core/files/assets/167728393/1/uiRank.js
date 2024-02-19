var UiRank = pc.createScript('uiRank');

// initialize code called once per entity
UiRank.prototype.initialize = function() {
    this.oldRank = -1;
    this.rank = -1;
    this.gold = this.entity.findByName('gold');
    this.silver = this.entity.findByName('silver');
    this.bronze = this.entity.findByName('bronze');

    pn.on('rank', (list) => {
        let found = false;
        for (let [index, item] of list.entries()) {
            if (item[2] === this.entity?.script?.networkEntity.id) {
                this.rank = index + 1;
                found = true;
                break;
            }
        }

        if (!found) {
            this.rank = -1;
        }

        if (this.oldRank !== this.rank) {
            this.setRankUi(this.rank)
        }

        this.oldRank = this.rank;
    });
};

UiRank.prototype.setRankUi = function (rank) {
    this.gold.enabled = (rank === 1);
    this.silver.enabled = (rank === 2);
    this.bronze.enabled = (rank === 3);
}

UiRank.prototype.update = function (dt) {
    var valY = CAMERA.isBackView? 0 : 40;

    this.gold?.setEulerAngles(0, valY, 0);
    this.silver?.setEulerAngles(0, valY, 0);
    this.bronze?.setEulerAngles(0, valY, 0);
}