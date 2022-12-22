import * as THREE from "/modules/three.module.js";
import { Boids } from "./Boid.js";
class BoidsGenerator {
  constructor(scene) {
    this.scene = scene;
    this.numBoids = 1;
    this.boidsObjects = [];
  }
  create() {
    //Comment
    console.log("Creating!");

    for (let i = 0; i < this.numBoids; i++) {
      console.log("Created Boid with id:", i);
      let b = new Boids(this.scene);
      b.create();
      this.boidsObjects.push(b);
    }

    console.log("List of Boids", this.boidsObjects);
  }

  update() {
    for (let i = 0; i < this.boidsObjects.length; i++) {
      let alignment_force = this.boidsObjects[i]._calculateAlignmentForce(
        this.boidsObjects
      );
      let separation_force = this.boidsObjects[i]._calculateSeparationForce(
        this.boidsObjects
      );
      let cohesion_force = this.boidsObjects[i]._calculateCohesionForce(
        this.boidsObjects
      );
      //let separation_force = new THREE.Vector3(0.00, 0.00, 0.00);
      //let cohesion_force = new THREE.Vector3(0.00, 0.00, 0.00);
      this.boidsObjects[i]._applyForce(alignment_force);
      this.boidsObjects[i]._applyForce(separation_force);
      this.boidsObjects[i]._applyForce(cohesion_force);
      this.boidsObjects[i]._updatePhysics();
      this.boidsObjects[i]._updateMesh();
    }
  }
}

export { BoidsGenerator };
