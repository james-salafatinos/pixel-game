import * as THREE from "/modules/three.module.js";

class Boids {
  constructor(scene) {
    this.scene = scene;
    this.mesh;
    this.pos = new THREE.Vector3(
      Math.random() * 75 - 12,
      200 + Math.random() * 75 - 12,
      Math.random() * 75 - 12
    );
    this.velocity = new THREE.Vector3(
      0.01 * (2 * Math.random() - 1),
      0.01 * (2 * Math.random() - 1),
      0.01 * (2 * Math.random() - 1)
    );
    this.acceleration = new THREE.Vector3(0, 0, 0);
  }
  create() {
    // console.log("Creating!");

    this.scene.add(this._createSphere(this.pos.x, this.pos.y, this.pos.z));
  }

  // Mover applyForce
  _applyForce(force) {
    let a = force.clone();
    this.acceleration.add(a);
  }

  _updatePhysics() {
    this.velocity.add(this.acceleration.clone());
    this.pos.add(this.velocity.clone());
    this.acceleration.multiplyScalar(0);
  }

  _createSphere(posx, posy, posz) {
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0, 0, 0),
    });
    let geo = new THREE.IcosahedronGeometry(10, 1);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.position.x = posx;
    mesh.position.y = posy;
    mesh.position.z = posz;
    this.mesh = mesh;

    return mesh;
  }
  // _createSphere(_x, _y, _z) {
  //   geometry = new THREE.BufferGeometry();
  //   geometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(this.vertices, 3)
  //   );
  //   let material = new THREE.PointsMaterial({
  //     size: 0.7,
  //     sizeAttenuation: true,
  //     alphaTest: 0.2,
  //     transparent: false,
  //   });

  //   let mat_color = new THREE.Color("hsl(60, 82%, 56%)");
  //   material.color = mat_color;

  //   this.mesh = new THREE.Points(this.geometry, material);
  //   // this.scene.add(this.particles);
  // }
  _updateMesh() {
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;
  }

  _calculateAlignmentForce(listOfBoids) {
    let sumOfVelocities = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < listOfBoids.length; i++) {
      sumOfVelocities.add(listOfBoids[i].velocity.clone());
    }
    sumOfVelocities.normalize();
    let m = 1 - sumOfVelocities.dot(this.velocity.clone().normalize());
    //magnitude is 0 when aligned, 1 when orthogonal, 2 when opposite directions
    sumOfVelocities.multiplyScalar(m);
    return sumOfVelocities.multiplyScalar(0.01);
  }

  _calculateSeparationForce(listOfBoids) {
    let force = new THREE.Vector3(0, 0, 0);
    let epsilon = 0.00000001;
    for (let i = 0; i < listOfBoids.length; i++) {
      let dir = this.pos.clone().sub(listOfBoids[i].pos.clone()).normalize();
      let distance =
        this.pos.clone().distanceTo(listOfBoids[i].pos.clone()) + epsilon;
      force.add(dir.multiplyScalar(1 / distance));
    }
    return force.multiplyScalar(0.5);
  }

  _calculateCohesionForce(listOfBoids) {
    //Comment
    let force = new THREE.Vector3(0, 0, 0);
    for (let i = 0; i < listOfBoids.length; i++) {
      let dir = this.pos.clone().sub(listOfBoids[i].pos.clone()).normalize();
      let distance = this.pos.clone().distanceTo(listOfBoids[i].pos.clone());

      force.add(dir.multiplyScalar(-1 * distance));
    }
    return force.multiplyScalar(0.0001);
  }
}

export { Boids };
