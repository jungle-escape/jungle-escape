// var ClientTriggerTest = pc.createScript('clientTriggerTest');

// // initialize code called once per entity
// ClientTriggerTest.prototype.initialize = function() {
//     this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
// };

// ClientTriggerTest.prototype.onTriggerEnter = function (target) {
//     if (target.tags.has('player')) {
//         const level = this.app.root.findByName('Level');
//         const p2 = level.findByName("P2. Algorithm");
//         if (p2) {
//             if (p2.enabled) {
//                 p2.enabled = false;
//             } else {
//                 p2.enabled = true;
//             }
//         }    
//     }
// }