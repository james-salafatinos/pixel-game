//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";
import { CSS3DRenderer, CSS3DObject } from "/modules/CSS3DRenderer.js";
//Internal Libraries
import { NoClipControls } from "/utils/NoClipControls.js";
import { PhysicsObject } from "/utils/PhysicsObject.js";
import { _Crosshair } from "/utils/_Crosshair.js";

//THREE JS
let camera, scene, renderer, composer, controls;
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let physicsObjects = [];
let frameIndex = 0;
let labelRenderer;

let crosshair;

init();
animate();

function init() {
  scene = new THREE.Scene();
  var loader = new THREE.TextureLoader(),
    texture = loader.load("/static/nightsky2.jpg");
  scene.background = texture;
  scene.fog = new THREE.Fog(0xffffff, 100, 750);

  //Create three.js stats
  stats = new Stats();
  container.appendChild(stats.dom);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  labelRenderer = new CSS3DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  document.body.appendChild(labelRenderer.domElement);

  // LIGHTS
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  //Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 30;
  camera.position.z = 150;
  camera.position.x = 10;

  //NO CLIP CONTROLS
  controls = new NoClipControls(scene, window, camera, document);

  let createPlane = function () {
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x6a7699),
      opacity: 0.2,
    });
    let geo = new THREE.PlaneBufferGeometry(600, 600);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = 0;
    mesh.position.y = -15;
    mesh.position.z = 0;
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);
  };
  createPlane();

  let createStars = function () {
    let M = 28;
    let N = 28;
    let scaler = 10;
    let vertices = [];
    let spacing_scale = 50;
    for (let x = -M; x <= M; x += 1) {
      for (let z = -N; z <= N; z += 1) {
        // vertices.push(x / scaler, 0 / scaler, z / scaler)
        vertices.push(
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000),
          THREE.MathUtils.randFloatSpread(2000)
        );
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    let material = new THREE.PointsMaterial({
      size: 0.7,
      sizeAttenuation: true,
      alphaTest: 0.2,
      transparent: true,
    });
    material.color.setHSL(0.6, 0.8, 0.9);
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };
  createStars();

  //Large Star
  let p0 = new PhysicsObject(10000, 0, 0, 0, 0, 0, 0, 0, 1);
  p0.isStationary = true;
  p0.density = 10000;

  physicsObjects.push(p0);
  scene.add(p0.Sphere());

  //Object creation loop
  for (let i = 0; i < 10; i++) {
    let radius = 15;
    let x_offset = 25;
    let y_offset = 0;
    let z_offset = 0;
    let px = x_offset + (2 * Math.random() - 1) * radius;
    let py = y_offset + ((2 * Math.random() - 1) * radius) / 2;
    let pz = z_offset + (2 * Math.random() - 1) * radius;
    let physicsObject = new PhysicsObject(1, px, py, pz, 0, 0, 0, 0.05, 1);
    physicsObjects.push(physicsObject);
    scene.add(physicsObject.Sphere());
  }

  //Crosshair
  crosshair = new _Crosshair(scene, camera);
}

function animate() {
  const time = performance.now();
  //Frame Start up
  requestAnimationFrame(animate);

  controls.update(time, prevTime);
  crosshair.update();
  renderer.render(scene, camera);
  stats.update();
  //Force Application
  if (frameIndex % 1 == 0) {
    for (let i = 0; i < physicsObjects.length; i++) {
      for (let j = 0; j < physicsObjects.length; j++) {
        if (i !== j) {
          let f = physicsObjects[i].attract(physicsObjects[j]);
          physicsObjects[i].applyForce(f);
          physicsObjects[i].updatePhysics();
          physicsObjects[i].updateGeometry();
        }
      }
    }
  }

  //Frame Shut Down
  prevTime = time;
}
