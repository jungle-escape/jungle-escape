/* eslint-disable no-var */
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

import scripts from './scripts.js';

import { unifyPath } from './utils.js';

class Templates {
    apps = new Map();

    assetIdByPath = new Map();

    logging = false;

    async initialize(directory) {
        this.directory = directory;

        pc.ComponentSystem.prototype.addComponent = function addComponent(entity, data) {
            if (data === 0) {
                data = {};
            }

            var component = new this.ComponentType(this, entity);
            var componentData = new this.DataType();
            this.store[entity.getGuid()] = {
                entity,
                data: componentData
            };

            component.originalData = data;
            entity[this.id] = component;
            entity.c[this.id] = component;
            this.initializeComponentData(component, data, []);
            this.fire('add', entity, component);
            return component;
        };

        pc.Entity.prototype._cloneRecursively = function _cloneRecursively(duplicatedIdsMap) {
            var clone = new pc.Entity(this._app);

            pc.GraphNode.prototype._cloneInternal.call(this, clone);

            for (var type in this.c) {
                var component = this.c[type];
                component.system.cloneComponent(this, clone);
                clone[type].originalData = component.originalData;
            }

            for (var i = 0; i < this._children.length; i++) {
                var oldChild = this._children[i];

                if (oldChild instanceof pc.Entity) {
                    var newChild = oldChild._cloneRecursively(duplicatedIdsMap);

                    clone.addChild(newChild);
                    duplicatedIdsMap[oldChild.getGuid()] = newChild;
                }
            }

            return clone;
        };

        pc.Template.prototype.instantiate = function instantiate(app) {
            if (app) {
                this._app = app;
            }

            this._parseTemplate();
            const entity = this._templateRoot.clone();

            // TODO: HACK for client only scripts and entities. Maybe should remove it and implement system to create client-only scripts on backend in runtime
            for (const key in entity.script.originalData.scripts) {
                if (scripts.registry.has(key)) continue;
                const script = entity.script.originalData.scripts[key];

                for (const attrKey in script.attributes) {
                    const value = script.attributes[attrKey];
                    if (typeof value !== 'string') continue;
                    if (!value.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)) continue;

                    const path = this._templateRoot.findByGuid(value).path;
                    script.attributes[attrKey] = entity.findByPath(path).getGuid();
                }
            }

            return entity;
        };
    }

    async addApplication(app) {
        this.apps.set(app.room.id, { app, cache: new Map() });
        await this.loadTemplates(app);
        const watcher = this.watch(app);

        app.once('destroy', () => {
            this.apps.delete(app.room.id);
            watcher.close();
        });
    }

    // watches directory for file changes, to hand template reloading
    watch(app) {
        const watcher = chokidar.watch(this.directory);

        watcher
            .on('add', async path => this.loadTemplate(path, app))
            .on('change', async path => this.loadTemplate(path, app))
            .on('unlink', async path => {
                const id = this.assetIdByPath.get(path);
                const asset = app.assets.get(id);
                if (asset) app.assets.remove(asset);
                this.apps.get(app.room.id).cache.delete(path);
                if (this.logging) console.log('removed template: ', path);
            });

        return watcher;
    }

    async loadTemplates(app, directory = this.directory) {
        // Unify path to use same as chokidar
        directory = unifyPath(directory);

        const files = await fs.readdir(directory);

        for (let i = 0; i < files.length; i++) {
            const _path = `${directory}${path.sep}${files[i]}`;
            const stats = await fs.stat(_path);

            if (stats.isDirectory()) {
                await this.loadTemplates(app, _path);
            } else if (stats.isFile()) {
                await this.loadTemplate(_path, app);
            }
        }
    }

    async loadTemplate(path, app) {
        path = unifyPath(path);
        let data = await fs.readFile(path);
        data = data.toString();

        const cache = this.apps.get(app.room.id).cache.get(path);
        if (cache === data) return;

        try {
            const json = JSON.parse(data);

            if (cache) {
                if (this.logging) console.log('reloading template: ', path);

                // update existing
                try {
                    const asset = app.assets.get(json.id);
                    if (asset) app.assets.remove(asset);
                    this.createAsset(data, path, app);
                } catch (ex) {
                    console.log('failed updating template: ', path);
                    console.error(ex);
                }
            } else {
                try {
                    // load new
                    this.createAsset(data, path, app);
                } catch (ex) {
                    console.log('failed hot-loading template: ', path);
                    console.error(ex);
                }
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    createAsset(data, fullPath, app) {
        try {
            const json = JSON.parse(data);
            const asset = new pc.Asset(json.name, json.type, null, json.data);
            // id
            asset.id = json.id;
            asset.preload = true;
            // tags
            for (let i = 0; i < json.tags.length; i++) {
                asset.tags.add(json.tags[i]);
            }

            app.assets.add(asset);
            app.assets.load(asset);

            this.apps.get(app.room.id).cache.set(fullPath, data);

            if (this.logging) console.log('new template asset', fullPath);
            return asset;
        } catch (ex) {
            console.log('failed creating asset', fullPath);
            console.error(ex);
        }

        return null;
    }
}

export default new Templates();
