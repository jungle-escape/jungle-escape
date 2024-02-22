var DecayObject = pc.createScript("decayObject");

DecayObject.attributes.add("decayTime", {
  type: "number",
  default: 5,
  title: "Decay Time",
  description:
    "When collision checked, timer starts when collided. If not, timer starts on creation",
});
DecayObject.attributes.add("onCollision", {
  type: "boolean",
  default: true,
  title: "On Collision",
  description: "Should the object decay on collision",
});

DecayObject.prototype.initialize = function () {
  this.entity.render.material = this.entity.render.material.clone();
  this.entity.render.material.update();

  this.tweenTimeoutEvent = (second) => {
    return setTimeout(() => {
      // 1. delete hit tags as decay start
      this.entity.tags.clear();

      // 2. decay effect
      this.fromDiffuse = new pc.Color(1, 1, 1);
      this.toDiffuse = new pc.Color(0.3, 0.3, 0.3);

      // 3. decay animation
      this.entity
        .tween(this.fromDiffuse)
        .to(this.toDiffuse, 1, pc.ExponentialOut)
        .onUpdate(() => {
          this.entity.render.material.diffuse = this.fromDiffuse;
          this.entity.render.material.update();
        })
        .onComplete(() => {
          this.entity.rigidbody.group = 2;
        })
        .start();
    }, second * 1000);
  };

  this.entity.rigidbody.on("collisionstart", this.onCollisionStart, this);
};

DecayObject.prototype.onCollisionStart = function () {
  this.entity.rigidbody.off("collisionstart");

  const decayTimer = this.tweenTimeoutEvent(6);
  this.entity.once("destroy", () => {
    clearTimeout(decayTimer);
  });
  decayTimer();
};
