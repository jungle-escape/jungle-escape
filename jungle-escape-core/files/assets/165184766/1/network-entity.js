/**
 * @class NetworkEntity
 * @classdesc NetworkEntity is a {@link pc.ScriptType}, which is attached to a
 * {@link pc.ScriptComponent} of an {@link pc.Entity} that needs to be
 * synchronised between server and clients. It has unique ID, optional owner and
 * list of properties to be synchronised. For convenience, {@link pc.Entity} has
 * additional property: `entity.networkEntity`.
 * @extends pc.ScriptType
 * @property {string} id Unique identifier.
 * @property {boolean} mine Whether this entity is related to our User.
 * @property {Object[]} properties List of properties, which should be
 * synchronised and optionally can be interpolated. Each property `object` has
 * these properties:
 *
 *
 * | Param | Type | Description |
 * | --- | --- | --- |
 * | path | `string` | Path to a property. |
 * | interpolate | `boolean` | If value is type of: `number` &#124; `Vec2` &#124; `Vec3` &#124; `Vec4` &#124; `Quat` &#124; `Color`, then it can be interpolated. |
 * | ignoreForOwner | `boolean` | If `true` then server will not send this property updates to an owner. |
 */

/**
 * @event NetworkEntity#*
 * @description {@link NetworkEntity} will receive own named network messages.
 * @param {object|array|string|number|boolean} [data] Message data.
 */
var NetworkEntity = pc.createScript('networkEntity');
NetworkEntity.attributes.add('id', {
  title: 'Network ID',
  type: 'string',
  description: 'Read-only. Network ID which is set by server'
});
NetworkEntity.attributes.add('owner', {
  title: 'Owner',
  type: 'string',
  description: 'Read-only. User ID who is controlling an entity'
});
NetworkEntity.attributes.add('properties', {
  title: 'Properties',
  type: 'json',
  array: true,
  description: 'List of property paths to be synchronised',
  schema: [{
    type: 'string', // ex. 'position'
    name: 'path'
  }, {
    type: 'boolean',
    name: 'interpolate'
  }, {
    type: 'boolean',
    name: 'ignoreForOwner'
  }]
});

NetworkEntity.prototype.initialize = function () {
  this.app.networkEntity = this;
  this.entity.networkEntity = this;
  this.user = pn.room.users.get(this.owner);
  this.mine = this.user?.mine;
  this._pathParts = {};
  this.tmpObjects = new Map();
  this.tmpObjects.set(pc.Vec2, new pc.Vec2());
  this.tmpObjects.set(pc.Vec3, new pc.Vec3());
  this.tmpObjects.set(pc.Vec4, new pc.Vec4());
  this.tmpObjects.set(pc.Quat, new pc.Quat());
  this.tmpObjects.set(pc.Color, new pc.Color());
  this.vfx = this.entity.findByName('vfx');
  this.rules = {
    'parent': {
      get: state => {
        return state.parent;
      },
      set: state => {
        const parentEntity = this.app.root.findByGuid(state.parent); // TODO: performance?

        if (!parentEntity) return;
        this.entity.reparent(parentEntity);
      }
    },
    'localPosition': {
      get: state => {
        const tmpObject = this.tmpObjects.get(pc.Vec3);
        this.parsers.get(pc.Vec3)(tmpObject, state.localPosition);
        return tmpObject;
      },
      set: state => {
        const data = state.localPosition;
        this.entity.setLocalPosition(data.x, data.y, data.z);

        if (this.entity.rigidbody) {
          const position = this.entity.getPosition();
          const rotation = this.entity.getEulerAngles();
          this.entity.rigidbody.teleport(position, rotation);
        }
      }
    },
    'localRotation': {
      get: state => {
        const tmpObject = this.tmpObjects.get(pc.Quat);
        this.parsers.get(pc.Quat)(tmpObject, state.localRotation);
        return tmpObject;
      },
      set: state => {
        const data = state.localRotation;
        this.entity.setLocalRotation(data.x, data.y, data.z, data.w);

        if (this.entity.rigidbody) {
          const position = this.entity.getPosition();
          const rotation = this.entity.getEulerAngles();
          this.entity.rigidbody.teleport(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);
        }
      }
    },
    'position': {
      get: state => {
        const tmpObject = this.tmpObjects.get(pc.Vec3);
        this.parsers.get(pc.Vec3)(tmpObject, state.position);
        return tmpObject;
      },
      set: state => {
        const data = state.position;

        if (this.entity.rigidbody) {
          const rotation = this.entity.getEulerAngles();
          this.entity.rigidbody.teleport(data.x, data.y, data.z, rotation.x, rotation.y, rotation.z);
        } else {
          this.entity.setPosition(data.x, data.y, data.z);
        }
      // set: value => {
      //   var oldPos = this.entity.getPosition();
      //   var targetPos = value;

      //   this.entity.setPosition(value);

      //   if (this.entity.rigidbody) {
      //     this.entity.rigidbody.teleport(value.x, value.y, value.z);
      //   }
      }
    },
    'rotation': {
      get: state => {
        const tmpObject = this.tmpObjects.get(pc.Quat);
        this.parsers.get(pc.Quat)(tmpObject, state.rotation);
        return tmpObject;
      },
      set: state => {
        const data = state.rotation;
        this.entity.setRotation(data.x, data.y, data.z, data.w);

        if (this.entity.rigidbody) {
          const position = this.entity.getPosition();
          const rotation = this.entity.getEulerAngles();
          this.entity.rigidbody.teleport(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);
        }
      }
    },
    'scale': {
      get: state => {
        const tmpObject = this.tmpObjects.get(pc.Vec3);
        this.parsers.get(pc.Vec3)(tmpObject, state.scale);
        return tmpObject;
      },
      set: state => {
        const data = state.scale;
        this.entity.setLocalScale(data.x, data.y, data.z);
      }
    },
    // Privately added
    'animState': {
      get: state => {
        return state.animState;
      },
      set: state => {
        const data = state.animState;
        if (this.entity.tags.has('player')) {
          this.entity.children[0].anim.setBoolean('isRunning', data.isRunning);
          this.entity.children[0].anim.setBoolean('isJumping', data.isJumping);
          this.entity.children[0].anim.setBoolean('isAttacking', data.isAttacking);
          this.entity.children[0].anim.setBoolean('isHit', data.isHit);
          this.entity.children[0].anim.setBoolean('isVictory', data.isVictory);
          this.entity.children[0].anim.setBoolean('isVow', data.isVow);
          this.entity.canJump = data.canJump;
          this.entity.pcReactOn = data.pcReactOn;
          // this.entity.signalToClient = data.signalToClient;
        }
      }
    },
    'modelRotation': {
      get: state => {
        return state.modelRotation;
      },
      set: state => {
        const data = state.modelRotation;
        if (this.entity.tags.has('player')) {
          this.entity.children[0].setEulerAngles(data.x, data.y, data.z);
        }
      }
    },
    'bodyType': {
      get: state => {
        return state.bodyType;
      },
      set: state => {
        const data = state.bodyType;
        if (this.entity.tags.has('falling_platform')) {
          this.entity.rigidbody.bodyType = data;
        }
      }
    },
    'materialDiffuse': {
      get: state => {
        return state.materialDiffuse;
      },
      set: state => {
        this.entity.render.material.diffuse = state.materialDiffuse;
        this.entity.render.material.update();
      }
    },
    'rigidbodyGroup': {
      get: state => {
        return state.rigidbodyGroup;
      },
      set: state => {
        this.entity.rigidbody.group = state.rigidbodyGroup;
      }
    },
    'signalToClient' : {
      get: state => {
      },
      set: state => {
        if (!this.entity.tags.has('player')) {
          return;
        }

        const signals = state.signalToClient;
        this.entity.signalToClient = signals;

        if (signals?.length !== 0) {

        if (signals?.includes('pc_reaction')) {
            this.entity.isRunning = false;
            if (!this.entity.sound.slot('reaction').isPlaying) {
                this.entity.sound.play("reaction");
            }
        }

        if (signals?.includes('wrong')) {
            if (!this.entity.sound.slot('wrong').isPlaying) {
                this.entity.sound.play("wrong");
            }
            // Play vfx
            const hit = this.vfx.findByName('hit');
            hit.script.effekseerEmitter.play();

            // Enable UI
            const ui_x = this.entity.findByName('X');
            if (!ui_x?.enabled) {
                ui_x.enabled = true;
            }
        }

        if (signals?.includes('fall')) {
            if (!this.entity.sound.slot('fall').isPlaying) {
                this.entity.sound.play("fall");
            }
        } 

        if (signals?.includes('segfault')) {
            if (!this.entity.sound.slot('segfault').isPlaying) {
                this.entity.sound.play("segfault");
            }
        }    

        if (signals?.includes('rightanswer')) {
            if (!this.entity.sound.slot('rightanswer').isPlaying) {
                this.entity.sound.play("rightanswer");
            }
        }   

        if (signals?.includes('ggang')) {
            if (!this.entity.sound.slot('ggang').isPlaying) {
                this.modelEntity = this.entity.children[0];
                this.modelEntity.setEulerAngles(0, -90, 0);
                this.entity.sound.play("ggang");
                this.entity.isHit = true;
    
                // 1초 후에 isHit를 false로 설정
                setTimeout(() => {
                    this.entity.isHit = false;
                }, 500); // 0.5초 후 실행
            }
        }     

        if (signals?.includes('p1_right')) {
            if (!this.entity.sound.slot('rightanswer2').isPlaying) {
                this.entity.sound.play("rightanswer2");
            }

            // Enable UI
            const ui_o = this.entity.findByName('O');
            if (!ui_o?.enabled) {
                ui_o.enabled = true;
            }
        }  

        if (signals?.includes('hit_success')) {
            if (!this.entity.sound.slot('hit').isPlaying) {
                this.entity.sound.play("hit");
            }
        }  

        if (signals?.includes('hit')) {
            this.entity.isRunning = false;
            if (!this.entity.sound.slot('hit').isPlaying) {
                this.entity.sound.play("hit");
            }

            const hit = this.vfx.findByName('hit');
            hit.script.effekseerEmitter.play();
        } 

        if (signals?.includes('hit_receive')) {
            this.entity.isHit = true;
            if (!this.entity.sound.slot('hit').isPlaying) {
                this.entity.sound.play("hit");
            }

            // Play vfx
            const hit = this.vfx.findByName('hit');
            hit.script.effekseerEmitter.play();

            // 1초 후에 isHit를 false로 설정
            setTimeout(() => {
                this.entity.isHit = false;
            }, 500); // 0.5초 후 실행
        }

        if (signals?.includes('haha')) {
          if (!this.entity.sound.slot('haha').isPlaying) {
            this.entity.sound.play('haha');
          }
        }

        if (signals?.includes('byebye')) {
          if (!this.entity.sound.slot('byebye').isPlaying) {
            this.entity.sound.play('byebye');
          }
        }
        
       }
      }
    },
  };
  this.rulesInterpolate = {
    // TODO: add interpolation for localPosition/localRotation
    'position': {
      get: () => {
        return this.entity.getPosition();
      },
      set: value => {
        var oldPos = this.entity.getPosition();
        var targetPos = value;

        this.entity.setPosition(value);

        if (this.entity.rigidbody) {
          this.entity.rigidbody.teleport(value.x, value.y, value.z);
        }
      }
    },
    'rotation': {
      get: () => {
        return this.entity.getRotation();
      },
      set: value => {
        this.entity.setRotation(value);

        if (this.entity.rigidbody) {
          let position = this.entity.getPosition();
          let rotation = this.entity.getEulerAngles();
          this.entity.rigidbody.teleport(position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);
        }
      }
    },
    // Privately added
    'scale': {
      get: () => {
        return this.entity.getLocalScale();
      },
      set: value => {
        return this.entity.setLocalScale(value);
      }
    },
    'materialDiffuse': {
      get: () => {
        // console.debug('getting material interpolate');
        // return this.entity.render.material.diffuse;
      },
      set: value => {
        // console.debug('setting material interpolate of: ', value);
        // this.entity.render.material.diffuse = value;
        // this.entity.render.material.update();
      }
    },
  };
  this.rulesReAssignTypes = new Set();
  this.rulesReAssignTypes.add(pc.Vec2);
  this.rulesReAssignTypes.add(pc.Vec3);
  this.rulesReAssignTypes.add(pc.Vec4);
  this.rulesReAssignTypes.add(pc.Quat);
  this.rulesReAssignTypes.add(pc.Color);
  this.parsers = new Map();
  this.parsers.set(pc.Vec2, (value, data) => {
    return value.set(data.x, data.y);
  });
  this.parsers.set(pc.Vec3, (value, data) => {
    return value.set(data.x, data.y, data.z);
  });
  this.parsers.set(pc.Vec4, (value, data) => {
    return value.set(data.x, data.y, data.z, data.w);
  });
  this.parsers.set(pc.Quat, (value, data) => {
    return value.set(data.x, data.y, data.z, data.w);
  });
  this.parsers.set(pc.Color, (value, data) => {
    return value.set(data.r, data.g, data.b, data.a);
  });
  this.parsers.set(Map, (value, data) => {
    value.clear();

    for (let [k, v] of data) {
      value.set(k, v);
    }
  });
  this.entity.room.fire('_networkEntities:add', this);
};

NetworkEntity.prototype.postInitialize = function () {
  this.interpolations = new Map();

  for (let i = 0; i < this.properties.length; i++) {
    if (!this.properties[i].interpolate) continue;
    const path = this.properties[i].path;

    const parts = this._makePathParts(path);

    const rule = this.rulesInterpolate[path];
    let node = this.entity;

    for (let p = 0; p < parts.length; p++) {
      let part = parts[p];

      if (p === parts.length - 1) {
        let value;
        let setter;

        if (rule) {
          value = rule.get();
          setter = rule.set;
        } else {
          value = node[part];
        }

        this.interpolations.set(path, new InterpolateValue(value, node, part, setter, this.entity.room.tickrate));
      } else {
        node = node[part];
      }
    }
  }
};

NetworkEntity.prototype.swap = function (old) {
  this.mine = old.mine;
  this._pathParts = old._pathParts;
  this.tmpObjects = old.tmpObjects;
  this.rules = old.rules;
  this.rulesReAssignTypes = old.rulesReAssignTypes;
  this.rulesInterpolate = old.rulesInterpolate;
  this.parsers = old.parsers;
  this.interpolations = old.interpolations;
};

NetworkEntity.prototype.setState = function (state) {
  for (let i = 0; i < this.properties.length; i++) {
    if (this.mine && this.properties[i].ignoreForOwner) continue;
    const path = this.properties[i].path; // ex. 'position'

    const parts = this._makePathParts(path);

    const rule = this.rules[path]; // ex. this.rules['position']
    const interpolator = this.interpolations.get(path);

    if (rule && state[path] !== undefined) {
      if (interpolator) {
        const interpolatorRule = this.rulesInterpolate[path];

        if (interpolatorRule) {
          interpolator.add(rule.get(state));
          continue;
        }
      }

      rule.set(state);
      continue;
    }

    let node = this.entity;
    let stateNode = state;

    for (let p = 0; p < parts.length; p++) {
      let part = parts[p];
      if (stateNode[part] === undefined) continue;

      if (p === parts.length - 1) {
        if (node[part] && typeof node[part] === 'object') {
          const parser = this.parsers.get(node[part].constructor);

          if (parser) {
            if (interpolator) {
              const tmpObject = this.tmpObjects.get(node[part].constructor);
              parser(tmpObject, stateNode[part]);
              interpolator.add(tmpObject);
            } else {
              if (this.rulesReAssignTypes.has(node[part].constructor)) {
                node[part] = parser(node[part], stateNode[part]);
              } else {
                parser(node[part], stateNode[part]);
              }
            }
          } else if (node[part].constructor === Object) {
            node[part] = stateNode[part];
          } else {
            // unknown property type, cannot set
            continue;
          }
        } else {
          node[part] = stateNode[part];
        }
      } else {
        if (!node[part] || typeof node[part] === 'function') continue;
        node = node[part];
        stateNode = stateNode[part];
      }
    }
  }
};
/**
 * @method send
 * @description Send named message to a server related to this NetworkEntity.
 * @param {string} name Name of a message.
 * @param {object|array|string|number|boolean} [data] JSON friendly message data.
 * @param {responseCallback} [callback] Callback that will be fired when response message is received.
 */


NetworkEntity.prototype.send = function (name, data, callback) {
  pn._send(name, data, 'networkEntity', this.id, callback);
};

NetworkEntity.prototype._makePathParts = function (path) {
  let parts = this._pathParts[path];

  if (!parts) {
    parts = path.split('.');
    this._pathParts[path] = parts;
  }

  return parts;
};

NetworkEntity.prototype.update = function (dt) {
  for (const interpolator of this.interpolations.values()) {
    interpolator.update(dt);
  }
};
