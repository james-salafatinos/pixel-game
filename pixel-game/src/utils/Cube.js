import * as THREE from "/modules/three.module.js";
import { entity } from "/utils/entity.js";
class Cube extends entity {
  constructor(scene) {
    super();
    this.scene = scene;
    this.mesh = null;
  }

  init() {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);

    this.mesh = cube;
    this.scene.add(this.mesh);
  }
  update() {
    this.mesh.rotation.x += 0.01;
  }
}

export { Cube };
