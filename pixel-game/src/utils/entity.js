import * as THREE from "/modules/three.module.js";
class entity {
  constructor() {
    console.log("Entity Constructor");
    this.entities = [];
  }

  Init() {
    console.log("Entity Init");
  }
  Destroy() {
    console.log("Entity Destroy");
  }
}

export { entity };
