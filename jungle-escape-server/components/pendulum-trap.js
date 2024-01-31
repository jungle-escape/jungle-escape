var PendulumTrap = pc.createScript("pendulumTrap");

PendulumTrap.attributes.add('speed', { type: 'number' });
PendulumTrap.attributes.add('reverse', { type: 'boolean' });

PendulumTrap.prototype.initialize = function () {
    this.time = 0;
    this.direction = this.reverse ? 1 : -1;
};

PendulumTrap.prototype.swap = function (old) {
    this.time = old.time;
    // this.direction = this.reverse ? 1 : -1;
};

PendulumTrap.prototype.update = function (dt) {
    this.time += this.direction * dt * this.speed;

    if (this.time > 1 || this.time < 0) {
        this.direction *= -1;
        this.time = pc.math.clamp(this.time, 0, 1);
    }

    const position = this.entity.getPosition();
    const x = position.x;
    const y = position.y;
    const z = position.z;
    const rx = 0;
    const ry = 0;
    // Rotating starts from -270 to 90.
    // Narrowing down the range from -60 to 60
    const rz = (this.time * 360 + 180) / 4;

    this.entity.rigidbody.teleport(x, y, z, rx, ry, rz);
};