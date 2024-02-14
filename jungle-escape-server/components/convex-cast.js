/**
 * Convex Cast
 * https://forum.playcanvas.com/t/playcanvas-physics-extension/13737
 *
 * Change log:
 *
 *      1.3 -   Fixed a bug in convex shape lifecycle. Not all created shapes were
 *              destroying.
 *
 *      1.2 -   Changed filename, to avoid naming conflict with the yaustar's
 *              raycastByTag extension.
 *
 *      1.1 -   Fixed bug with memory leak. It appears most of the shapes
 *              don't have native methods to changes them after creatiion. And
 *              Those that do, Ammo doesn't have a binding for them. The shape is
 *              now destoyed after the convex sweep test completes.
 *          -   Added ability to change Sphere Shape collision margin.
 *
 *      1.0 -   Initial release
 */

(function () {
  // Allocate memory for shape handling
  pc.RigidBodyComponentSystem._convexShapesData = Object.create(null);
  pc.RigidBodyComponentSystem._convexShapesData.ammoHalfExtents =
    new Ammo.btVector3();
  pc.RigidBodyComponentSystem._convexShapesData.ammoRotFrom =
    new Ammo.btQuaternion();
  pc.RigidBodyComponentSystem._convexShapesData.ammoRotTo =
    new Ammo.btQuaternion();
  pc.RigidBodyComponentSystem._convexShapesData.ammoPosFrom =
    new Ammo.btVector3();
  pc.RigidBodyComponentSystem._convexShapesData.ammoPosTo =
    new Ammo.btVector3();
  pc.RigidBodyComponentSystem._convexShapesData.ammoTransformFrom =
    new Ammo.btTransform();
  pc.RigidBodyComponentSystem._convexShapesData.ammoTransformTo =
    new Ammo.btTransform();
  pc.RigidBodyComponentSystem._convexShapesData.pcMat4 = new pc.Mat4();
  pc.RigidBodyComponentSystem._convexShapesData.pcStartRot = new pc.Quat();
  pc.RigidBodyComponentSystem._convexShapesData.pcEndRot = new pc.Quat();

  /**
   * @class
   * @name ConvexCastResult
   * @classdesc Object holding the result of a successful raycast hit.
   * @description Create a new ConvexCastResult.
   * @param {pc.Entity} entity - The entity that was hit.
   * @param {number} hitFraction - A number in range from 0 to 1 along the sweep path, where hit occured.
   * @param {pc.Vec3} point - The point at which the collision occured in world space.
   * @param {pc.Vec3} normal - The normal vector of the surface where the ray hit in world space.
   * @property {pc.Entity} entity - The entity that was hit.
   * @property {number} hitFraction - A number in range from 0 to 1 along the sweep path, where hit occured.
   * @property {pc.Vec3} point - The point at which the collision occured in world space.
   * @property {pc.Vec3} normal - The normal vector of the surface where the ray hit in world space.
   */
  var ConvexCastResult = function ConvexCastResult(
    entity,
    hitFraction,
    point,
    normal
  ) {
    this.entity = entity;
    this.hitFraction = hitFraction;
    this.point = point;
    this.normal = normal;
  };

  /**
   * @function
   * @name pc.RigidBodyComponentSystem#convexCast
   * @description Casts a convex shape along the linear path from startPos to endPos. Returns ConvexCastResult if
   * there is a hit, otherewise null.
   * @param {Ammo shape} shape - Convex shape used for sweep test.
   * @param {pc.Vec3} startPos - The world space point where the hit test starts.
   * @param {pc.Vec3} endPos - The world space point where the test ends.
   * @param {pc.Quat} [startRot] - Initial rotation of the shape.
   * @param {pc.Quat} [endRot] - Final rotation of the shape.
   * @param {number} [allowedPenetration] - CCD allowance margin.
   * @returns {ConvexCastResult} object holding the hit result or null.
   */
  pc.RigidBodyComponentSystem.prototype.convexCast = function (
    shape,
    startPos,
    endPos,
    startRot,
    endRot,
    allowedPenetration
  ) {
    var result = null;
    var rot = null;
    var data = pc.RigidBodyComponentSystem._convexShapesData;

    if (!startRot || !endRot)
      rot = data.pcMat4.setLookAt(startPos, endPos, pc.Vec3.UP);

    if (!startRot) startRot = data.pcStartRot.setFromMat4(rot);

    if (!endRot) endRot = data.pcEndRot.setFromMat4(rot);

    if (!allowedPenetration) allowedPenetration = 0;

    data.ammoPosFrom.setValue(startPos.x, startPos.y, startPos.z);
    data.ammoPosTo.setValue(endPos.x, endPos.y, endPos.z);
    data.ammoTransformFrom.setOrigin(data.ammoPosFrom);
    data.ammoTransformTo.setOrigin(data.ammoPosTo);
    data.ammoRotFrom.setValue(startRot.x, startRot.y, startRot.z, startRot.w);
    data.ammoTransformFrom.setRotation(data.ammoRotFrom);
    data.ammoRotTo.setValue(endRot.x, endRot.y, endRot.z, endRot.w);
    data.ammoTransformFrom.setRotation(data.ammoRotTo);

    var convexCallback = new Ammo.ClosestConvexResultCallback(
      data.ammoPosFrom,
      data.ammoPosTo
    );

    this.dynamicsWorld.convexSweepTest(
      shape,
      data.ammoTransformFrom,
      data.ammoTransformTo,
      convexCallback,
      allowedPenetration
    );
    if (convexCallback.hasHit()) {
      var collisionObj = convexCallback.get_m_hitCollisionObject();
      var body = Ammo.castObject(collisionObj, Ammo.btRigidBody);

      if (body) {
        var hitFraction = convexCallback.get_m_closestHitFraction();
        var point = convexCallback.get_m_hitPointWorld();
        var normal = convexCallback.get_m_hitNormalWorld();

        result = new ConvexCastResult(
          body.entity,
          hitFraction,
          new pc.Vec3(point.x(), point.y(), point.z()),
          new pc.Vec3(normal.x(), normal.y(), normal.z())
        );
      }
    }

    Ammo.destroy(shape);
    Ammo.destroy(convexCallback);
    return result;
  };

  //
  // Convenience methods
  //

  pc.RigidBodyComponentSystem.prototype.coneCast = function (
    radius,
    height,
    startPos,
    endPos,
    orientation,
    startRot,
    endRot,
    allowedPenetration
  ) {
    if (!orientation) orientation = pc.Vec3.UP;
    var shape = _getConeShape(radius, height, orientation, this);
    if (!shape) throw "Failed to generate cone shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  pc.RigidBodyComponentSystem.prototype.sphereCast = function (
    radius,
    startPos,
    endPos,
    margin,
    startRot,
    endRot,
    allowedPenetration
  ) {
    var shape = _getSphereShape(radius, margin, this);
    if (!shape) throw "Failed to generate sphere shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  pc.RigidBodyComponentSystem.prototype.boxCast = function (
    halfExtents,
    startPos,
    endPos,
    margin,
    startRot,
    endRot,
    allowedPenetration
  ) {
    var shape = _getBoxShape(halfExtents, margin);
    if (!shape) throw "Failed to generate box shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  pc.RigidBodyComponentSystem.prototype.cylinderCast = function (
    halfExtents,
    startPos,
    endPos,
    orientation,
    startRot,
    endRot,
    allowedPenetration
  ) {
    if (!orientation) orientation = pc.Vec3.UP;
    var shape = _getCylinderShape(halfExtents, orientation);
    if (!shape) throw "Failed to generate cylinder shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  pc.RigidBodyComponentSystem.prototype.capsuleCast = function (
    radius,
    height,
    startPos,
    endPos,
    margin,
    startRot,
    endRot,
    allowedPenetration
  ) {
    var shape = _getCapsuleShape(radius, height, margin);
    if (!shape) throw "Failed to generate capsule shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  pc.RigidBodyComponentSystem.prototype.shapeCast = function (
    points,
    startPos,
    endPos,
    margin,
    startRot,
    endRot,
    allowedPenetration
  ) {
    var shape = _getConvexHullShape(points);
    if (!shape) throw "Failed to generate convex hull shape. Check attributes.";
    return this.convexCast(
      shape,
      startPos,
      endPos,
      startRot,
      endRot,
      allowedPenetration
    );
  };

  //
  // Helper functions
  //

  _getConeShape = function (r, h, orientation) {
    var shape = null;
    switch (orientation) {
      case pc.Vec3.UP:
        shape = new Ammo.btConeShape(r, h);
        break;

      ///btConeShape implements a Cone shape, around the X axis
      case pc.Vec3.RIGHT:
        shape = new Ammo.btConeShapeX(r, h);
        break;

      ///btConeShapeZ implements a Cone shape, around the Z axis
      case pc.Vec3.BACK:
        shape = new Ammo.btConeShapeZ(r, h);
        break;

      default:
        throw "Invalid orientation";
    }
    return shape;
  };

  _getSphereShape = function (r, margin) {
    var sphere = new Ammo.btSphereShape(r);
    if (margin) sphere.setMargin(margin);
    return sphere;
  };

  _getBoxShape = function (halfExtents, margin) {
    var ammoHalfExtents =
      pc.RigidBodyComponentSystem._convexShapesData.ammoHalfExtents;
    ammoHalfExtents.setValue(halfExtents.x, halfExtents.y, halfExtents.z);
    var shape = new Ammo.btBoxShape(ammoHalfExtents);
    if (margin) shape.setMargin(margin);
    return shape;
  };

  _getCylinderShape = function (halfExtents, orientation) {
    var shape = null;
    var ammoHalfExtents =
      pc.RigidBodyComponentSystem._convexShapesData.ammoHalfExtents;
    ammoHalfExtents.setValue(halfExtents.x, halfExtents.y, halfExtents.z);
    switch (orientation) {
      case pc.Vec3.UP:
        shape = new Ammo.btCylinderShape(ammoHalfExtents);
        break;

      ///btCylinderShapeX implements a Cone shape, around the X axis
      case pc.Vec3.RIGHT:
        shape = new Ammo.btCylinderShapeX(ammoHalfExtents);
        break;

      ///btCylinderShapeZ implements a Cone shape, around the Z axis
      case pc.Vec3.BACK:
        shape = new Ammo.btCylinderShapeZ(ammoHalfExtents);
        break;

      default:
        throw "Invalid orientation";
    }
    return shape;
  };

  _getCapsuleShape = function (r, h, margin) {
    var shape = new Ammo.btCapsuleShape(r, h);
    if (margin) shape.setMargin(margin);
    return shape;
  };

  _getConvexHullShape = function (points) {
    var shape = new Ammo.btConvexHullShape(points, points.length, 3);
    return shape;
  };
})();
