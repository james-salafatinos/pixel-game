import * as THREE from "/modules/three.module.js";
import { MultiplayerObject } from "./MultiplayerObject.js";

class Player extends MultiplayerObject {
  constructor(scene) {
    super();
    this.scene = scene;

    this.mesh = new THREE.Mesh(
      new THREE.BoxGeometry(6, 6, 6),
      new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    this.mesh.position.y = 1;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = "Player";
    // this.mesh.userData = {
    //   socket_id: this.socket_id,
    // };
  }
}
export { Player };
