import * as THREE from "/modules/three.module.js";
import { entity } from "/utils/entity.js";
class PixelCube extends entity {
  constructor(scene) {
    super();
    this.scene = scene;
    this.mesh = null;
  }

  init() {
    const loader = new THREE.TextureLoader();
    var treetexture = loader.load("/static/tree.jpg");
    treetexture.magFilter = THREE.NearestFilter;
    var treematerial = new THREE.SpriteMaterial({ map: treetexture });
    var treesprite = new THREE.Sprite(treematerial);
    treesprite.scale.set(10, 10, 10);
    treesprite.position.set(0, 5, 0);

    this.mesh = treesprite;
    this.scene.add(this.mesh);
  }
  update() {
    console.log("updating :)");
  }
}

export { PixelCube };
