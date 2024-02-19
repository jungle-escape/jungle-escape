var FinishButton = pc.createScript("finishButton");

import pn from "../custom_modules/playnetwork/src/server/index.js";

FinishButton.attributes.add("positionYCurve", { type: "curve" });
FinishButton.attributes.add("triggerEntity", { type: "entity" });
FinishButton.attributes.add("connectedEntity", { type: "entity" });
FinishButton.attributes.add("tags", { type: "string", array: true });

FinishButton.prototype.initialize = function () {
  this.defaultPositionY = this.entity.getPosition().y;
  this.vec3 = this.entity.getPosition().clone();
  this.time = 0;
  this.activations = 0;

  this.triggerEntity.collision.on("triggerenter", this.onTriggerEnter, this);
  this.isFinished = false;

  //for ending ranking
  const level = this.app.root.findByName("Level");
  const p5 = level?.findByName("P5. End");
  this.groundEnd = p5?.findByName("GroundEnd");
};

FinishButton.prototype.swap = function (old) {
  this.defaultPositionY = old.defaultPositionY;
  this.vec3 = old.vec3;
  this.time = old.time;
  this.activations = old.activations;

  this.triggerEntity.collision.off("triggerenter", old.onTriggerEnter, old);

  this.triggerEntity.collision.on("triggerenter", this.onTriggerEnter, this);
};

FinishButton.prototype.update = function (dt) {
  if (!this.entity.rigidbody) return;

  this.time += (this.activations > 0 ? dt : -dt) * 5;
  this.time = pc.math.clamp(this.time, 0, 1);
  this.vec3.y = this.defaultPositionY + this.positionYCurve.value(this.time);

  this.entity.rigidbody.teleport(this.vec3);
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

FinishButton.prototype.onTriggerEnter = async function (entity) {
  if (!entity || !this.hasTag(entity.tags) || this.isFinished) {
    return;
  }

  this.isFinished = true;

  //calc rank
  var rankingList = [];
  var pointA = this.groundEnd.getPosition().clone();
  pointA.y = 0;
  for (let [id, networkEntity] of pn.networkEntities) {
    var u = networkEntity;
    if (u.user) {
      var uPos = u.rules.position();
      var pointB = { x: uPos.x, y: 0, z: u.rules.position().z };
      var distance = pointA.distance(pointB);
      let info = [distance, u.entity.name, u.__attributes.id];
      rankingList.push(info);
      u.user.send("pgbar", distance);
    }
  }
  rankingList.sort((a, b) => {
    return a[0] - b[0];
  });

  //this.entity.networkEntity.send("winner", entity.networkEntity.user.id);
  this.entity.networkEntity.send("winner", rankingList);
  this.entity.networkEntity.send("countdown", "3");
  await delay(1000); // 1초 딜레이
  this.entity.networkEntity.send("countdown", "2");
  await delay(1000); // 1초 딜레이
  this.entity.networkEntity.send("countdown", "1");
  await delay(1000); // 1초 딜레이

  for (let [id, networkEntity] of pn.networkEntities) {
    var u = networkEntity.user;
    if (u && u.leave instanceof Function) {
      u.leave();
    }
  }
};

FinishButton.prototype.hasTag = function (tags) {
  for (let i = 0; i < this.tags.length; i++) {
    if (tags.has(this.tags[i])) return true;
  }

  return false;
};
