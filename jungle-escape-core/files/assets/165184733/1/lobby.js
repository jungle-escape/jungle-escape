// Lobby is used to save level, start room or join already created
var Lobby = pc.createScript('lobby');

Lobby.attributes.add('levelId', { type: 'number' });

Lobby.attributes.add('createButton', { type: 'entity' });
Lobby.attributes.add('joinButton', { type: 'entity' });
Lobby.attributes.add('saveButton', { type: 'entity' });
Lobby.attributes.add('roomIdInputEntity', { type: 'entity' });

// Connect with backend, and initialize room
Lobby.prototype.initialize = function () {
    LOBBY = this;

    this.createButton.button.on('click', this.onCreateClick, this);
    this.joinButton.button.on('click', this.onJoinClick, this);
    this.saveButton.button.on('click', this.onSaveClick, this);
    this.roomIdInputEntity.on('input:confirm', this.join, this);

    const params = new URLSearchParams(window.location.search);

    // const host = '43.201.73.158';
    const host = 'localhost';
    const port = params.get('port') || '8080';

    pn.connect(host, port, true, null, () => {
        pn.on('join', (room) => {
            this.entity.enabled = false;

            room.on('join', (user) => {
                LOG.addText(`User ${user.id} joined`);
            });

            room.on('leave', (user) => {
                LOG.addText(`User ${user.id} left`);
            });
        });

        pn.on('leave', () => {
            this.entity.enabled = true;
        });
    });
};

Lobby.prototype.onCreateClick = function () {
    this.createButton.button.active = false;

    pn.createRoom({ levelId: this.levelId, tickrate: 20 }, (_, id) => {
        this.createButton.button.active = true;
        pn.joinRoom(id);
    });
};

Lobby.prototype.onJoinClick = function () {
    const roomId = parseInt(this.roomIdInputEntity.script.textInput.element.value, 10);
    pn.joinRoom(roomId);
};

Lobby.prototype.onSaveClick = function () {
    pn.levels.save(this.levelId, (err) => {
        if (!err) {
            console.log('Level saved successfully');
        }
    });
};
