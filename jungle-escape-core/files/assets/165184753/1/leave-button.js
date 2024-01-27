var LeaveButton = pc.createScript('leaveButton');

LeaveButton.prototype.initialize = function () {
    this.entity.element.on('click', () => {
        pn.leaveRoom();
    });
};
