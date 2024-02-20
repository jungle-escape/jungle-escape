var RollingStones = pc.createScript("rollingStones");

RollingStones.attributes.add("interval", {
  type: "number",
  enum: [{ slow: 5 }, { standard: 3 }, { fast: 2 }, { "super fast": 1 }],
  default: 3,
});
RollingStones.attributes.add("stones", {
  title: "Stone templates",
  type: "json",
  array: true,
  description: "Templates supposed to work as Network Entity",
  schema: [
    {
      type: "asset",
      assetType: "template",
      name: "template",
    },
  ],
});

RollingStones.prototype.initialize = function () {
  this.time = 0;
  this.stoneEntities = [];
  this.playerArrivedHandler = () => {
    // Store the function reference
    this.intervalId = setInterval(() => {
      this.onDynamic();
    }, this.interval * 1000);
  };
  this.app.on("_player:arrived", this.playerArrivedHandler, this);

  this.once("destroy", () => {
    clearInterval(this.intervalId);
    this.app.off("_player:arrived", this.playerArrivedHandler, this); // Use .off with the stored reference
  });

  this._stones = this.stones.map((t) => t.template.resource);
};

RollingStones.prototype.onDynamic = function () {
  const stone = this._stones[Math.floor(Math.random() * this._stones.length)];
  const entity = stone.instantiate(this.app);
  this.stoneEntities.push(entity);
  entity.enabled = true;
  this.entity.addChild(entity);

  setTimeout(() => {
    // 엔티티 파괴 전에 배열에서 제거
    const index = this.stoneEntities.indexOf(entity);
    if (index > -1) {
      this.stoneEntities.splice(index, 1);
    }

    // 엔티티가 이미 파괴되지 않았는지 확인
    if (entity && !entity.destroyed) {
      entity.destroy();
    }
  }, 15000);
};
