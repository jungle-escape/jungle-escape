var Game = pc.createScript('game');

import pn from '../custom_modules/playnetwork/src/server/index.js';

Game.attributes.add('userTemplate', { type: 'asset', assetType: 'template' });

Game.prototype.initialize = function () {
    this.networkEntities = this.app.room.networkEntities;
    this.users = new Map();

    this.tplUser = this.userTemplate.resource;

    this.app.room.on('join', this.onJoin, this);
    this.app.room.on('leave', this.onLeave, this);

    this.once('destroy', () => {
        this.app.room.off('join', this.onJoin, this);
        this.app.room.off('leave', this.onLeave, this);
    });
};

Game.prototype.swap = function (old) {
    this.networkEntities = old.networkEntities;
    this.users = old.users;

    this.tplUser = old.tplUser;

    old.app.room.off('join', old.onJoin, this);
    old.app.room.off('leave', old.onLeave, this);

    this.app.room.on('join', this.onJoin, this);
    this.app.room.on('leave', this.onLeave, this);
};

Game.prototype.onJoin = function (user) {
    // user entity
    const entity = this.tplUser.instantiate(this.app);
    entity.name = 'User ' + user.id;
    entity.script.networkEntity.owner = user.id;
    this.entity.addChild(entity);
    this.users.set(user.id, entity);
};

Game.prototype.onLeave = function (user) {
    const entity = this.users.get(user.id);
    if (!entity) return;

    entity.destroy();
    this.users.delete(user.id);

    if (this.app.room.users.size === 0) this.app.room.destroy();
};

Game.prototype.toData = function () {
    return {
        users: this.users,
    };
};

Game.prototype.update = function () {
    var list = [];
    var pointA = new pc.Vec3(0, 0, -620);
    for (let [id, networkEntity] of pn.networkEntities) {
        var u = networkEntity;
        if (u.user) {
            var pointB = u.rules.position()
            var distance = pointA.distance(pointB);
            let info = [distance, `user ${u.user.id}`];
            list.push(info);
        }
    }
    list.sort((a, b) => {
        return a[0] - b[0];
    });
    this.app.room.send('rank', list);
};
