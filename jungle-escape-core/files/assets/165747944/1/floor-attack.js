var FloorAttack = pc.createScript('floorAttack');
FloorAttack.attributes.add("speed", { type: "number" });
FloorAttack.attributes.add("isTriggered", { type: "boolean", default: false });
FloorAttack.attributes.add("targetCell", {
    type: "entity",
    title: "target Entity",
    description: "The attacker block will be attack here",
});