import * as http from 'http';
import * as https from 'https';
import * as pc from 'playcanvas';
import console from './libs/logger.js';
import WebSocket from 'faye-websocket';
import deflate from './libs/permessage-deflate/permessage-deflate.js';
import { downloadAsset, updateAssets } from './libs/assets.js';

import User from './core/user.js';
import performance from './libs/performance.js';

import levels from './libs/levels.js';
import scripts from './libs/scripts.js';
import templates from './libs/templates.js';

import Servers from './core/servers.js';
import Rooms from './core/rooms.js';
import Users from './core/users.js';

import Ammo from './libs/ammo.js';

import { createClient } from 'redis';

global.pc = {};
for (const key in pc) {
    global.pc[key] = pc[key];
}

/**
 * @class PlayNetwork
 * @classdesc Main interface of PlayNetwork server. This class handles clients connection and communication.
 * @extends pc.EventHandler
 * @property {number} id Numerical ID of the server.
 * @property {Users} users {@link Users} interface that stores all connected users.
 * @property {Rooms} rooms {@link Rooms} interface that stores all rooms and handles new {@link Rooms} creation.
 * @property {Map<number, NetworkEntity>} networkEntities Map of all {@link NetworkEntity}s created by this server.
 * @property {number} bandwidthIn Bandwidth of incoming data in bytes per second.
 * @property {number} bandwidthOut Bandwidth of outgoing data in bytes per second.
 * @property {number} cpuLoad Current CPU load 0..1.
 * @property {number} memory Current memory usage in bytes.
 */

/**
 * @callback responseCallback
 * @param {null|Error} error Error provided with a response.
 * @param {null|object|array|string|number|boolean} data Data provided with a response.
 */

/**
 * @event PlayNetwork#error
 * @description Unhandled error.
 * @param {Error} error {@link Error} object.
 */

/**
 * @event PlayNetwork#*
 * @description {@link PlayNetwork} will receive own named network messages. Those messages are sent by the clients.
 * @param {User} sender User that sent the message.
 * @param {object|array|string|number|boolean} [data] Message data.
 * @param {responseCallback} callback Callback that can be called to respond to a message.
 */

class PlayNetwork extends pc.EventHandler {
    constructor() {
        super();

        this.id = null;
        this.port = null;

        this.servers = new Servers();
        this.users = new Users();
        this.rooms = new Rooms();
        this.networkEntities = new Map();

        this._reservedEvents = ['destroy'];

        process.on('uncaughtException', (err) => {
            console.error(err);
            this.fire('error', err);
            return true;
        });

        process.on('unhandledRejection', (err, promise) => {
            console.error(err);
            err.promise = promise;
            this.fire('error', err);
            return true;
        });
    }

    /**
     * @method start
     * @description Start PlayNetwork, by providing configuration parameters.
     * @async
     * @param {object} settings Object with settings for initialization.
     * @param {string} settings.redisUrl URL of a {@link Redis} server.
     * @param {string} settings.websocketUrl Publicly or inter-network accessible URL to this servers WebSocket endpoint.
     * @param {string} settings.scriptsPath Relative path to script components.
     * @param {string} settings.templatesPath Relative path to templates.
     * @param {object} settings.levelProvider Instance of a level provider.
     * @param {http.Server|https.Server} settings.server Instance of a http(s) server.
     */
    async start(settings) {
        this._validateSettings(settings);
        await this.connectRedis(settings.redisUrl);

        this.port = settings.server.address().port;
        this.id = await this.generateId('server', settings.websocketUrl || 'null');

        const startTime = Date.now();

        if (settings.useAmmo) global.Ammo = await new Ammo();

        await levels.initialize(settings.levelProvider);
        await scripts.initialize(settings.scriptsPath);
        await templates.initialize(settings.templatesPath);
        this.rooms.initialize();

        settings.server.on('upgrade', (req, ws, body) => {
            if (!WebSocket.isWebSocket(req)) return;

            let socket = new WebSocket(req, ws, body, [], { extensions: [deflate] });
            let user = null;

            socket.on('open', async () => { });

            socket.on('message', async (e) => {
                if (typeof e.data !== 'string') {
                    e.rawData = e.data.rawData;
                    e.data = e.data.data.toString('utf8', 0, e.data.data.length);
                } else {
                    e.rawData = e.data;
                }

                e.msg = JSON.parse(e.data);

                const callback = (err, data) => {
                    if (err || e.msg.id) socket.send(JSON.stringify({ name: e.msg.name, data: err ? { err: err.message } : data, id: e.msg.id }));
                };

                if (e.msg.name === '_authenticate') return socket.emit('_authenticate', e.msg.data, callback);

                const sender = e.msg.userId ? await this.users.get(e.msg.userId) : user;

                await this._onMessage(e.msg, sender, callback);
            });

            socket.on('close', async () => {
                if (user) {
                    await user.destroy();
                }

                socket = null;
            });

            socket.on('_authenticate', async (payload, callback) => {
                const connectUser = (id) => {
                    user = new User(id, socket);
                    this.users.add(user);
                    callback(null, user.id);
                    performance.connectSocket(socket, user);
                    console.log(`User ${user.id} connected`);
                };

                if (!this.users.hasEvent('authenticate')) {
                    const id = await this.generateId('user');
                    connectUser(id);
                } else {
                    this.users.fire('authenticate', payload, async (err, userId) => {
                        if (err) {
                            callback(err);
                            socket.close();
                        } else {
                            await this.redis.HSET('_route:user', userId, this.id);
                            connectUser(userId);
                        }
                    });
                }
            });
        });

        performance.addCpuLoad(this);
        performance.addMemoryUsage(this);
        performance.addBandwidth(this);

        console.info(`PlayNetwork started in ${Date.now() - startTime} ms`);
    }

    async connectRedis(url) {
        this.redis = createClient({ url });
        this.redisSubscriber = this.redis.duplicate();

        try {
            await this.redis.connect();
            await this.redisSubscriber.connect();
        } catch (err) {
            throw new Error(`Failed to connect to Redis at ${url}, ${err.code}. Ensure it is installed and/or is reachable across the network.`);
        }

        this.redisSubscriber.SUBSCRIBE('_destroy:user', async (id) => {
            const user = await this.users.get(id);
            if (!user || !user.serverId) return;
            user.destroy();
        });

        console.info('Connected to Redis on ' + url);
    }

    async generateId(type, value) {
        const id = await this.redis.INCR('_id:' + type);
        if (!value) value = this.id;

        await this.redis.HSET(`_route:${type}`, id, value);
        return id;
    }

    async downloadAsset(saveTo, id, token) {
        const start = Date.now();
        if (await downloadAsset(saveTo, id, token)) {
            console.info(`Asset downloaded ${id} in ${Date.now() - start} ms`);
        };
    }

    async updateAssets(directory, token) {
        const start = Date.now();
        if (await updateAssets(directory, token)) {
            console.info(`Assets updated in ${Date.now() - start} ms`);
        }
    }

    async _onMessage(msg, sender, callback) {
        if (this._reservedEvents.includes(msg.name)) return callback(new Error(`Event ${msg.name} is reserved`));

        if (this.hasEvent(msg.name)) {
            this.fire(msg.name, sender, msg.data, callback);
            return;
        }

        let target = null;

        switch (msg.scope?.type) {
            case 'server':
                target = this;
                break;
            case 'user':
                target = await this.users.get(msg.scope.id);
                break;
            case 'room':
                target = this.rooms.get(msg.scope.id);
                break;
            case 'networkEntity':
                target = this.networkEntities.get(msg.scope.id);
                break;
        }


        if (!target) {
            const serverId = parseInt(await this.redis.HGET(`_route:${msg.scope?.type}`, msg.scope.id.toString()));
            if (!serverId) return;
            this.servers.get(serverId, (server) => {
                server.send(msg.name, msg.data, msg.scope?.type, msg.scope?.id, sender.id, callback);
            });
            return;
        };

        target.fire(msg.name, sender, msg.data, callback);
    }

    _validateSettings(settings) {
        let error = '';

        if (!settings) throw new Error('settings is required');

        if (!settings.redisUrl)
            error += 'settings.redisUrl is required\n';

        if (!settings.scriptsPath)
            error += 'settings.scriptsPath is required\n';

        if (!settings.templatesPath)
            error += 'settings.templatesPath is required\n';

        if (!settings.levelProvider)
            error += 'settings.levelProvider is required\n';

        if (!settings.server || (!(settings.server instanceof http.Server) && !(settings.server instanceof https.Server)))
            error += 'settings.server is required\n';

        if (error) throw new Error(error);
    }
}

export default new PlayNetwork();
