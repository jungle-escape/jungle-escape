var FloorAttack = pc.createScript('floorAttack');
FloorAttack.attributes.add("speed", { type: "number" });
FloorAttack.attributes.add("isTriggered", { type: "boolean", default: false });
FloorAttack.attributes.add("targetCell", {
    type: "entity",
    title: "target Entity",
    description: "The attacker block will be attack here",
});

// FloorAttack.prototype.initialize = function () {
//     pn.on(`${this.entity.name}`, () => {
//         if (!this.entity.sound.slot('ggang').isPlaying) {
//             this.entity.sound.play("ggang");
//         };
//     });
// }

// FloorAttack.prototype.onCollisionStart = function (hit) {
//     if (hit.other.tags.has('player')) {
//         if (!this.entity.sound.slot('ggang').isPlaying) {
//             this.entity.sound.play("ggang");
//         };
//     };
// }