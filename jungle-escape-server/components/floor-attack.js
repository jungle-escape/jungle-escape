var FloorAttack = pc.createScript("floorAttack");
/** server script for attack  */
FloorAttack.attributes.add("speed", { type: "number" });
FloorAttack.attributes.add("isTriggered", { type: "boolean", default: false });

FloorAttack.prototype.initialize = function () {
  // keep original position for returning
  this.originPos = this.entity.getPosition().clone();
  this.originLocalPos = this.entity.getLocalPosition().clone();

  // if not, entity's rotation is polluted.
  this.entity.setLocalRotation({
    x: 0,
    y: 0,
    z: 0,
    w: 1,
  });

  // parent-block's localPosition
  this.blockPos = new pc.Vec3(0, 0, 0);

  // start position
  this.startLocalPos = new pc.Vec3(
    this.blockPos.x,
    this.blockPos.y,
    this.blockPos.z
  );
  this.startLocalPos.z += 10;

  // Set target point Position
  this.targetPos = new pc.Vec3(
    this.blockPos.x,
    this.blockPos.y,
    this.blockPos.z
  );
  this.targetPos.z = -80;

  // setting for controller
  this.isMovedToStartPos = false;
  this.isMoveEnd = false;
  this.isReturn = false;

  this.isRunning = false;
};

FloorAttack.prototype.swap = function (old) {
  this.speed = old.speed;

  this.originPos = old.originPos;
  this.originLocalPos = old.originLocalPos;

  this.blockPos = old.blockPos;
  this.startLocalPos = old.startLocalPos;
  this.targetPos = old.targetPos;

  this.isMovedToStartPos = old.isMovedToStartPos;
  this.isMoveEnd = old.isMoveEnd;
  this.isReturn = old.isReturn;

  this.isRunning = old.isRunning;
};

FloorAttack.prototype.update = function (dt) {
  if (this.isReturn && this.isRunning) {
    // finished action, by unlock isRunning.
    this.isTriggered = false;
    this.isMoveEnd = false;
    this.isReturn = false;
    this.isRunning = false;
    this.isMovedToStartPos = false;

    return;
  }

  if (this.isMoveEnd) {
    //If attacking movement is finished, reset it's position
    this.entity.rigidbody.teleport(this.originPos);
    this.entity.setLocalPosition(this.originLocalPos);
    this.isReturn = true; //check it is returned.

    return;
  }

  if (this.isTriggered && !this.isMovedToStartPos) {
    // move block to right position for acttack.
    // lock the state as 'running' prevent other trigger from other user.
    this.isRunning = true;
    this.entity.setLocalPosition(this.startLocalPos);
    this.isMovedToStartPos = true;

    return;
  }
  if (this.isTriggered && this.isMovedToStartPos && this.isRunning) {
    //If it is triggered, setted for attack, and in running state...
    var currentPosition = this.entity.getLocalPosition();
    var targetPosition = this.targetPos;

    var distance = targetPosition.sub(currentPosition);

    if (distance.length() > 2) {
      var speedMultiplier = 2;
      var direction = distance.normalize();

      var moveDistance = direction.scale(this.speed * dt * speedMultiplier);

      var newPosition = currentPosition.add(moveDistance);
      this.entity.setLocalPosition(newPosition);
    } else {
      //if the distance is short enough, finishe the movement.
      this.isMoveEnd = true;
    }
  }
};

FloorAttack.prototype.onCollisionStart = function (hit) {
  if (hit.other.tags.has("player")) {
    var otherEntity = hit.other;
    var forceDirection = new pc.Vec3(10, 10, 10);
    forceDirection.normalize();
    var forceMagnitude = 10000000;
    var force = forceDirection.scale(forceMagnitude);
    if (otherEntity.rigidbody) {
      otherEntity.rigidbody.applyForce(force.x, force.y, force.z);
    }
  }
};
