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

    // const params = new URLSearchParams(window.location.search);

    const host = window._endpoint;
    // const host = 'localhost';
    const placeholder = host === 'localhost' ? 'DEV' : 'PROD';
    const port = placeholder === 'DEV' ? '8080' : null;
    const isSecure = placeholder === 'DEV' ? false : true;

    console.info(`Connecting to [[[ ${placeholder} ]]] server...`)
    pn.connect(host, port, isSecure, null, () => {
        pn.on('join', (room) => {
            this.entity.enabled = false;

            room.on('join', (user) => {
                //LOG.addText(`User ${user.id} joined`);

                LOG.addText(`${this.convertUsername(user)} joined`);
            });

            room.on('leave', (user) => {
                //LOG.addText(`User ${user.id} left`);

                LOG.addText(`${this.convertUsername(user)} left`);
            });
        });

        // 이벤트 리스너 추가
        pn.on('countdown', (num) => {
            ENDLOG.addText(num);
            // pn.off('rank');
            // pn.off('time');

        });

        pn.on('start', (num) => {
            STARTLOG.addText(num);
            if (num === "3...") {
                // CAMERA.switchView();
            }
        });

        pn.on('falling', () => {
            HELLOWORLD.boom();
        });

        pn.on('time', (time) => {
            // ELAPSEDTIME.addText(time.toFixed(1));
            ELAPSEDTIME.addText(this.convertTime(time.toFixed(1)));
        });

        pn.on('winner', (winner) => {
            //기존 winner = user.id를 전달
            if (typeof winner === 'number') {
                WINNER.addText(`Guest ${winner} win!\n\nGAME OVER`);
            }
            //신규 로직 rankingList를 winner라는 이름으로 전달
            // rankingList [ [ 11.767155780757323, '[Guest] 716', '195-485' ] ]
            else {
                WINNER.addText(`${this.convertWinner(winner)} win!\n\nGAME OVER`);
            }


        });

        pn.on('pgbar', (dis) => {
            var runner = PROGRESSBAR.entity.findByName(`runner1`);
            runner.setLocalPosition(-200 + ((1400 - dis) * (5 / 11)), -5, 0);
            BAR.setProgress((1400 - dis) / 1100);
        });

        pn.on('rank', (list) => {
            var text = '';
            list.forEach((item, index) => {
                //console.log("item[1] ", item[1]);
                text += "[ " + (index + 1) + " ] " + item[1] + '\n';
            });
            RANK.addText(text);
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


Lobby.prototype.convertTime = function (timeString) {
    // timeString은 time.toFixed(1)의 결과인 문자열
    var time = parseFloat(timeString); // 문자열을 실수로 변환
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);
    var milliseconds = Math.round((time % 1) * 10);

    // 초가 10보다 작을 경우 앞에 '0'을 추가
    var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    // 밀리초가 10보다 작을 경우 뒤에 '0'을 추가하여 항상 두 자리를 유지하도록 함 
    var formattedMilliseconds = milliseconds < 10 ? milliseconds + "0" : milliseconds.toString();

    // 변환된 시간을 문자열로 결합
    var formattedTime = minutes + ":" + formattedSeconds + ":" + formattedMilliseconds;

    return formattedTime;

}

// for addTexts
Lobby.prototype.convertUsername = function (user) {
    let showname;
    //if nickname is not exist, guest naming
    if (!user.nickname) {
        showname = "Guest " + user.id;
    }
    //if nickname exist, use the nickname
    else if (user.nickname) {
        showname = user.nickname;
    }
    // if any other troubles, show user.id(number)
    else {
        console.log("[convertUsername] user.nickname issue occured!");
        showname = `User ${user.id}`;
    }

    return `${showname}`;
};

//for winner 
Lobby.prototype.convertWinner = function (rankingList) {
    return rankingList[0][1]
};