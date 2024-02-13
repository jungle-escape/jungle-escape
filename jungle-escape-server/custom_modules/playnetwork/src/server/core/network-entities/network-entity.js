import equal from "fast-deep-equal";
import parsers from "./parsers.js";
import { roundTo } from "../../libs/utils.js";

/**
 * @class NetworkEntity
 * @classdesc NetworkEntity is a {@link pc.ScriptType}, which is attached to a
 * {@link pc.ScriptComponent} of an {@link pc.Entity} that needs to be
 * synchronised between server and clients. It has unique ID, optional owner and
 * list of properties to be synchronised. For convenience, {@link pc.Entity} has
 * additional property: `entity.networkEntity`.
 * @extends pc.ScriptType
 * @property {string} id Unique identifier within a server.
 * @property {User} user Optional {@link User} to which this
 * {@link pc.Entity} is related.
 * @property {Object[]} properties List of properties, which should be
 * synchronised and optionally can be interpolated. Each property `object` has
 * these properties:
 *
 *
 * | Param | Type | Description |
 * | --- | --- | --- |
 * | path | `string` | Path to a property. |
 * | interpolate | `boolean` | If value is type of: `number` &#124; `Vec2` &#124; `Vec3` &#124; `Vec4` &#124; `Quat` &#124; `Color`, then it can be interpolated. |
 * | ignoreForOwner | `boolean` | If `true` then server will not send this property updates to its related user. |
 */

/**
 * @event NetworkEntity#*
 * @description {@link NetworkEntity} will receive own named network messages.
 * @param {User} sender {@link User} that sent the message.
 * @param {object|array|string|number|boolean} [data] Message data.
 * @param {responseCallback} callback Callback that can be called to respond to a message.
 */

const NetworkEntity = pc.createScript("networkEntity");

NetworkEntity.attributes.add("id", { type: "string", default: -1 });
NetworkEntity.attributes.add("owner", { type: "string" });
NetworkEntity.attributes.add("properties", {
  title: "Properties",
  type: "json",
  array: true,
  description: "List of property paths to be synchronised",
  schema: [
    { type: "string", name: "path" },
    { type: "boolean", name: "interpolate" },
    { type: "boolean", name: "ignoreForOwner" },
  ],
});

NetworkEntity.prototype.initialize = function () {
  this.entity.networkEntity = this;
  this.user = this.app.room.users.get(this.owner);

  this._pathParts = {};
  this.cachedState = {};
  this.invalidPaths = new Set();

  // special rules
  this.rules = {
    parent: () => {
      return this.entity.parent?.getGuid() || null;
    },
    localPosition: () => {
      const value = this.entity.getLocalPosition();
      return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
    },
    localRotation: () => {
      const value = this.entity.getLocalRotation();
      return {
        x: roundTo(value.x),
        y: roundTo(value.y),
        z: roundTo(value.z),
        w: roundTo(value.w),
      };
    },
    position: () => {
      const value = this.entity.getPosition();
      return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
    },
    rotation: () => {
      const value = this.entity.getRotation();
      return {
        x: roundTo(value.x),
        y: roundTo(value.y),
        z: roundTo(value.z),
        w: roundTo(value.w),
      };
    },
    scale: () => {
      const value = this.entity.getLocalScale();
      return { x: roundTo(value.x), y: roundTo(value.y), z: roundTo(value.z) };
    },
    // Privately added
    animState: () => {
      const value = this.entity.animState;
      if (value) {
        return value;
      }
    },
    modelRotation: () => {
      const value = this.entity.modelRotation;
      if (value) {
        return { x: value.x, y: value.y, z: value.z };
      }
    },
    bodyType: () => {
      const value = this.entity.bodyType;
      if (value) {
        return value;
      }
    },
    collisionTags: () => {
      const value = this.entity.collisionTags;
      if (value) {
        return value;
      }
    },
    materialDiffuse: () => {
      const value = this.entity.materialDiffuse;
      if (value) {
        return value;
      }
    },
    rigidbodyGroup: () => {
      const value = this.entity.rigidbody?.group;
      if (value) {
        return value;
      }
    }
  };

  this.once("destroy", this.onDestroy, this);
};

NetworkEntity.prototype.postInitialize = function () {
  if (this.id) return;

  let parent = this.entity.parent;

  while (parent) {
    if (parent.networkEntity && !parent.networkEntity.id) return;
    parent = parent.parent;
  }

  this.app.room.networkEntities.create(this);
};

NetworkEntity.prototype.swap = function (old) {
  this.user = old.user;
  this._pathParts = old._pathParts;
  this.cachedState = old.cachedState;
  this.invalidPaths = old.invalidPaths;
  this.rules = old.rules;

  // TODO: remove when playcanvas application will be destroyed properly
  // https://github.com/playcanvas/engine/issues/4135
  old.off("destroy", old.onDestroy, old);
  this.once("destroy", this.onDestroy, this);
};

/**
 * @method send
 * @description Send a named message to a {@link NetworkEntity}.
 * It will be received by all clients that know about this NetworkEntity.
 * @param {string} name Name of a message.
 * @param {object|array|string|number|boolean} [data] JSON friendly message data.
 */
NetworkEntity.prototype.send = function (name, data) {
  for (const user of this.app.room.users.values()) {
    user._send(name, data, "networkEntity", this.id);
  }
};

NetworkEntity.prototype.onDestroy = function () {
  // TODO: remove when playcanvas application will be destroyed properly
  // https://github.com/playcanvas/engine/issues/4135
  this.user = null;
};

NetworkEntity.prototype.propertyAdd = function (path) {
  if (this.properties.findIndex((p) => p.path === path) === -1) return;

  this.properties.push({ path });
};

NetworkEntity.prototype.propertyRemove = function (path) {
  const ind = this.properties.findIndex((p) => p.path === path);
  if (this.id === -1) return;
  this.properties.splice(ind, 1);
};

NetworkEntity.prototype.getState = function (force) {
  const state = {};
  let flag = false;
  

  for (let i = 0; i < this.properties.length; i++) {
    const path = this.properties[i].path;
    const parts = this._makePathParts(path);
    const rule = this.rules[path];
    if (path === 'materialDiffuse') flag = true;
    console.log(flag);
    // if (flag) console.log(JSON.stringify(parts));

    let node = this.entity;
    let cachedStateNode = this.cachedState;
    let stateNode = state;

    for (let p = 0; p < parts.length; p++) {
      const part = parts[p];

      if (
        !rule &&
        (node === null ||
          node === undefined ||
          node === {} ||
          node[part] === undefined)
      ) {
        if (!this.invalidPaths.has(path)) {
          console.warn(
            `Network entity "${this.entity.name}", id: ${this.id}. Property path "${path}" is leading to unexisting data`
          );
          this.invalidPaths.add(path);
        }

        break;
      }

      let value = null;

      if (p === parts.length - 1) {
        if (rule) {
          value = rule();
        } else if (typeof node[part] === "object" && node[part]) {
          const parser = parsers.get(node[part].constructor);
          if (!parser) continue;
          value = parser(node[part]);
        } else {
          value = node[part];
        }

        if (force || !equal(value, cachedStateNode[part])) {
          cachedStateNode[part] = value;

          for (let i = 0; i < p; i++) {
            if (!stateNode[parts[i]]) stateNode[parts[i]] = {};

            stateNode = stateNode[parts[i]];
          }

          stateNode[part] = value;
        }
      } else {
        if (!cachedStateNode[part]) cachedStateNode[part] = {};

        if (typeof node[part] === "function") {
          node = node[part]();
        } else {
          node = node[part];
        }

        cachedStateNode = cachedStateNode[part];
      }
    }
  }

  if (Object.keys(state).length === 0) return null;

  state.id = this.id;
  state.owner = this.owner;

  return state;
};

NetworkEntity.prototype._makePathParts = function (path) {
  let parts = this._pathParts[path];
  if (!parts) {
    parts = path.split(".");
    this._pathParts[path] = parts;
  }
  return parts;
};
