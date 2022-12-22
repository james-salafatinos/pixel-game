import * as THREE from "/modules/three.module.js";

class TerrainGeometryGenerator {
  constructor(scene, document) {
    this.scene = scene;
    this.document = document;
    this.terrain;
    this.addGround();
    // How much to scale the height of the heightfield.
    this.height_scale = 200;
    this.vertices;
    this.newVertices;
    this.octree_mesh;
  }

  getTerrainPixelData() {
    let img = this.document.getElementById("landscape-image");
    this.img = img;
    console.log(this.img);

    var canvas = document.getElementById("canvas");

    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);

    var data = canvas
      .getContext("2d")
      .getImageData(0, 0, img.width, img.height).data;
    var normPixels = [];

    for (var i = 0, n = data.length; i < n; i += 4) {
      // get the average value of R, G and B.
      normPixels.push((data[i] + data[i + 1] + data[i + 2]) / 3);
    }

    return normPixels;
  }
  addGround() {
    this.terrain = this.getTerrainPixelData();
    console.log(this.terrain);

    //var geometry = new THREE.PlaneGeometry(2400, 2400*img.width/img.height, img.height-1, img.width-1);
    var geometry = new THREE.PlaneBufferGeometry(
      (2000 * this.img.width) / this.img.height,
      2000,
      this.img.width - 1,
      this.img.height - 1
    );
    this.vertices = geometry.attributes.position.array;
    this.newVertices = new Float32Array(this.vertices.length);

    var material = new THREE.MeshPhongMaterial({
      color: 0x00a0a0,
      wireframe: false,
    });

    console.log(this.terrain.length, this.newVertices.length);
    let counterIdx = 0;
    for (var i = 2, l = this.vertices.length; i < l; i += 3) {
      //i 2 --> i 0 || 0
      //i 5 --> i 3 || 1
      //i 8 --> i 6 || 2
      var terrainValue = this.terrain[counterIdx] / 255;

      // this.newVertices[i] = this.vertices[i] + Math.random() * 100;
      this.newVertices[i] = this.vertices[i] + terrainValue * 100;
      counterIdx += 1;
    }

    //Adding , should be optimized
    for (var i = 0, l = this.vertices.length; i < l; i++) {
      this.newVertices[i] += this.vertices[i];
    }

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(this.newVertices, 3)
    );
    geometry.attributes.position.needsUpdate = true;

    // might as well free up the input data at this point, or I should say let garbage collection know we're done.
    this.terrain = null;

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    var plane = new THREE.Mesh(geometry, material);

    plane.geometry.position = new THREE.Vector3(0, 0, 0);

    var q = new THREE.Quaternion();
    q.setFromAxisAngle(new THREE.Vector3(-1, 0, 0), (90 * Math.PI) / 180);
    plane.quaternion.multiplyQuaternions(q, plane.quaternion);

    console.log("Plane", plane);
    plane.material.visible = false;
    this.octree_mesh = plane; //steals the visible mesh

    let visiblePlaneMesh = plane.clone();
    visiblePlaneMesh.material.visible = true;

    this.scene.add(visiblePlaneMesh);
  }
}

export { TerrainGeometryGenerator };
