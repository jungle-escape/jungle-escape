var MovementBackAndForthX = pc.createScript('movementBackAndForth_x');
/** 처음 위치에서 앞뒤(x)로 일정 거리만큼 움직이는 물체에 설정하는 스크립트입니다. */


// // 원본 

// MovementBackAndForthX.prototype.initialize = function () {
//   this.currPos = this.entity.position;
// };

// MovementBackAndForthX.prototype.swap = function (old) {
//   this.currPos = old.currPos;
// };
// // update code called every frame
// MovementBackAndForthX.prototype.update = function (dt) {
//   //console.log("this.currPos", this.currPos);
//   this.entity.setPosition(
//     this.currPos.x - Math.sin(Date.now() / 200) * 2,
//     this.currPos.y,
//     this.currPos.z + Math.sin(Date.now() / 200) * 2
//   );
// };
