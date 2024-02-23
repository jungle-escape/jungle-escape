var SoundController = pc.createScript('soundController');

// // initialize code called once per entity
// SoundController.prototype.initialize = function() {
//     this.app.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
// };

// SoundController.prototype.onKeyDown = function(event) {
    // if (event.key === pc.KEY_B) {
    //     const bgm = this.app.root.findByName('BGM');
    //     console.log("BGM : ", bgm);
    //     var slots = bgm.sound.slots;
    //     for (var slotName in slots) {
    //         var slot = slots[slotName];
    //         this.toggleSound(slot);
    //     }
    // }
// };

// SoundController.prototype.toggleSound = function(slot) {
//     if (slot.isPlaying) {
//         slot.pause();
//     } else if (slot.isPaused) {
//         slot.resume();
//     }
// };