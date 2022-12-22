import * as THREE from "/modules/three.module.js";

class TerrainGenerator {
  constructor(scene) {
    this.scene = scene;
    this.octree_mesh;
  }
  create() {
    const geo_landscape = new THREE.PlaneBufferGeometry(2000, 2000, 200, 400);
    console.log(geo_landscape);

    let disMap = new THREE.TextureLoader()
      .setPath("/static/")
      .load("heightmap1.png");

    let aMap = new THREE.TextureLoader()
      .setPath("/static/")
      .load("heightmap1.png");
    // .load('alphamap4.png')

    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    disMap.repeat.set(2, 2);

    aMap.wrapS = aMap.wrapT = THREE.RepeatWrapping;
    aMap.repeat.set(2, 2);
    const mat_landscape = new THREE.MeshPhongMaterial({
      color: 0x000000,
      wireframe: false,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      alphaMap: aMap,
      // map: disMap,
      displacementMap: disMap,
      displacementScale: 80,
    });

    const matWire_landscape = new THREE.MeshPhongMaterial({
      color: 0x000000,
      wireframe: true,
      displacementMap: disMap,
      depthWrite: true,
      depthTest: true,
      transparent: true,
      alphaMap: aMap,
      displacementScale: 80,
    });
    let groundMesh = new THREE.Mesh(geo_landscape, mat_landscape);
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.5;
    this.octree_mesh = groundMesh;

    // let groundMesh2 = new THREE.Mesh(geo_landscape, matWire_landscape);
    // groundMesh2.receiveShadow = true;
    // this.scene.add(groundMesh2);
    // groundMesh2.rotation.x = -Math.PI / 2;
    // groundMesh2.position.y = -0.5;
  }
}

export { TerrainGenerator };
