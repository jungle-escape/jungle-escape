var UiRoomId = pc.createScript('uiRoomId');

UiRoomId.prototype.initialize = function () {
    this.entity.element.text = 'Room ID: ' + (this.entity.room.id || 0);
};
