import * as THREE from "/modules/three.module.js";
class MkWFC {
  constructor(scene) {
    this.n = 4;
    this.scene = scene;
    this.texture;
  }
  run() {
    //Repeat this process for every tile instance
    this._loadImg();
    this._splitTextureIntoTiles(this.texture);
  }
  _loadImg(fileName) {
    const geo_landscape = new THREE.PlaneBufferGeometry(2000, 2000, 200, 400);
    console.log(geo_landscape);
    let aMap = new THREE.TextureLoader().setPath("/static/").load(fileName);
    console.log(aMap);
    aMap.wrapS = aMap.wrapT = THREE.RepeatWrapping;
    aMap.repeat.set(1, 1);
    aMap.offset = new THREE.Vector2(400, 400);
    this.texture = aMap;

    const matWire_landscape = new THREE.MeshPhongMaterial({
      color: 0x000000,
      //   wireframe: true,

      displacementMap: aMap,
      depthWrite: true,
      depthTest: true,
      transparent: true,
      alphaMap: aMap,
      displacementScale: 100,
    });
    let groundMesh = new THREE.Mesh(geo_landscape, matWire_landscape);
    groundMesh.receiveShadow = true;

    this.scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
    // console.log(aMap);
    // this.scene.add(aMap);
    // return aMap;
    console.log(groundMesh);
    return groundMesh;
  }
  _splitTextureIntoTiles(aMap) {
    // aMap.offset = new THREE.Vector2(0.2, 1);
    console.log("aMap", aMap.offset);
  }

  _calculateConstraintPairs(n) {
    //e = a + b = y, where e is the total number of neighborhood pairs
    // n as in n x n grid
    let a = (n - 2) ** 2 * 4;
    let b = (n - 2) * 4 * 3;
    let y = 8;
    return a + b + y;
  }
}

class _MarkovChain {
  constructor() {
    this.head;
    this.tail = [];
  }
}

export { MkWFC };
