//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";
import { OrbitControls } from "/modules/orbitControls.module.js";

//Internal Libraries
import { Cube } from "/utils/Cube.js";
import { PixelCube } from "/utils/PixelCube.js";
import { entityManager } from "/utils/entityManager.js";

//THREE JS
let camera, scene, renderer, controls, stats;

let EntityManager = new entityManager();

init();
animate();

function init() {
  let createScene = function () {
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader(),
      texture = loader.load("/static/bg.jpg");
    scene.background = texture;
    scene.fog = new THREE.Fog(0x102234, 700, 1000);
  };
  createScene();

  let createLights = function () {
    // LIGHTS
    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);
  };
  createLights();

  let createStats = function () {
    stats = new Stats();
    container.appendChild(stats.dom);
  };
  createStats();

  let createRenderer = function () {
    //Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement).setAttribute("id", "canvas");
  };
  createRenderer();

  let createCamera = function () {
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
  };
  createCamera();

  //App Manager
  //##############################################################################

  //Mirror

  // Controls
  controls = new OrbitControls(camera, canvas);

  let cube = new Cube(scene);
  cube.init();
  EntityManager.Add(cube);

  let pixelCube = new PixelCube(scene);
  pixelCube.init();
  EntityManager.Add(pixelCube);
}
function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  controls.update();

  for (let i = 0; i < EntityManager.entities.length; i++) {
    EntityManager.entities[i].update();
  }

  stats.update();
  renderer.render(scene, camera);
}
