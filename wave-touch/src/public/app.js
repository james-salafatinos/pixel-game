//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";
//Internal Libraries
import { NoClipControls } from "/utils/NoClipControls.js";
import { TerrainGenerator } from "/utils/TerrainGenerator.js";
import { WaveGenerator } from "/utils/WaveGenerator.js";

import { MultiplayerSubsystemClient } from "../utils/MultiplayerSubsystemClient.js";
import { MultiplayerGameInterface } from "../utils/MultiplayerGameInterface.js";
import { MultiplayerText } from "../utils/MultiplayerText.js";

//THREE JS

//CDN
// import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";

let camera, scene, renderer, composer, controls;
let stats;
//Required for NOCLIPCONTROLS
let prevTime = performance.now();
let physicsObjects = [];
let frameIndex = 0;
let labelRenderer;
// let iFrame
let cameraLookDir;
let updatePositionForCamera;
let collisions;
// let SS;
let SS_Array = [];
let AL;
let PS;
let SKYDOME;
let label_meshes = [];

let MultiplayerSubsystemClientHandler;
let MultiplayerGameInterfaceHandler;
let MultiplayerTextHandler;

let sendmouse;
var socket;
let container;
container = document.getElementById("container");

let player;
let players = [];
let otherPlayer;

let waves;

let MAP = new THREE.TextureLoader();
init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color().setHSL(0.6, 0.9, 0.0);
  scene.fog = new THREE.Fog(0xffffff, 1, 5000);

  //Create three.js stats
  stats = new Stats();
  container.appendChild(stats.dom);

  //Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  container.appendChild(renderer.domElement);

  //   LIGHTS;
  let dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 500, 0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.camera.top = 512;
  dirLight.shadow.camera.left = -512;
  dirLight.shadow.camera.right = 512;
  dirLight.shadow.camera.bottom = -512;
  dirLight.shadow.camera.near = 0.5; // default
  dirLight.shadow.camera.far = 10000; // default

  const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
  scene.add(dirLightHelper);

  scene.add(dirLight);

  //Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 60;
  camera.position.z = 120;
  camera.position.x = 0;

  cameraLookDir = function (camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
  };

  //NO CLIP CONTROLS
  controls = new NoClipControls(scene, window, camera, document);

  MultiplayerSubsystemClientHandler = new MultiplayerSubsystemClient(io);
  MultiplayerGameInterfaceHandler = new MultiplayerGameInterface(
    scene,
    camera,
    MultiplayerSubsystemClientHandler
  );
  MultiplayerTextHandler = new MultiplayerText(
    window,
    scene,
    camera,
    MultiplayerSubsystemClientHandler,
    document
  );

  function mouseDragged() {
    //Crosshair
    cameraLookDir = function (camera) {
      var vector = new THREE.Vector3(0, 0, -1);
      vector.applyEuler(camera.rotation, camera.rotation.order);
      return vector;
    };
    let __x = camera.position.x + 2 * cameraLookDir(camera).x;
    let __y = camera.position.y + 2 * cameraLookDir(camera).y;
    let __z = camera.position.z + 2 * cameraLookDir(camera).z;

    sendmouse(__x, __y, __z);
  }

  // Function for sending to the socket
  sendmouse = function (xpos, ypos, zpos) {
    // We are sending!
    // console.log("sendmouse()FromClient: " + xpos + " " + ypos + " " + zpos);

    // Make a little object with  and y
    var data = {
      x: xpos,
      y: ypos,
      z: zpos,
    };

    // Send that object to the socket
    // socket.emit("MouseFromClient", data);
    MultiplayerSubsystemClientHandler.emit("MouseFromClient", data);
  };

  let createStars = function () {
    let M = 48;
    let N = 48;
    let vertices = [];
    for (let x = -M; x <= M; x += 1) {
      for (let z = -N; z <= N; z += 1) {
        // vertices.push(x / scaler, 0 / scaler, z / scaler)

        let rx = THREE.MathUtils.randFloatSpread(2000);
        let ry = THREE.MathUtils.randFloatSpread(2000) + 1100;
        let rz = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(rx, ry, rz);
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

  window.addEventListener("mousemove", () => {
    mouseDragged(3, 2, 5);
    // sendmouse();
  });

  window.addEventListener("KeyT", () => {
    mouseDragged(3, 2, 5);
    // sendmouse();
  });

  //   loadImage("texture1.png", 0, 60, 0, 50);

  // let terrain = new TerrainGenerator(scene);
  // terrain.create();
  // console.log(terrain);

  waves = new WaveGenerator(scene);
  console.log(waves);

  updatePositionForCamera = function (camera, myObject3D) {
    // fixed distance from camera to the object
    var dist = 100;
    var cwd = new THREE.Vector3();

    camera.getWorldDirection(cwd);

    cwd.multiplyScalar(dist);
    cwd.add(camera.position);

    myObject3D.position.set(cwd.x, cwd.y, cwd.z);
    myObject3D.setRotationFromQuaternion(camera.quaternion);
  };

  window.addEventListener("click", function (event) {
    console.log("In Double Click");
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (waves.click_wave_origin_xy.length - waves.chop_offset > 10) {
      console.log("MORE THAN 10, chop!");
      waves.chop_offset += 1;
    }
    //Raycast
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.05;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    raycaster.ray.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      console.log(
        "Pushing X,Y,Z",
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z
      );
      waves.click_wave_origin_xy.push([
        intersects[0].point.x,
        intersects[0].point.z,
      ]);
      // //Sphere
      // let g = new THREE.SphereBufferGeometry();
      // let matt = new THREE.MeshBasicMaterial();
      // let meshh = new THREE.Mesh(g, matt);
      // meshh.position.x = intersects[0].point.x;
      // meshh.position.z = intersects[0].point.z;
      // scene.add(meshh);

      //Inform Func
      waves.t_.push(waves.T);
      waves.clicks += 1;
    } else {
      // do nothing
    }
  });
}

function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  const time = performance.now();

  //   if (frameIndex % 5 == 0) {
  //     collisions.checkCollisions();
  //   }

  if (frameIndex % 3 == 0) {
    MultiplayerGameInterfaceHandler.updatePlayerState();
    MultiplayerSubsystemClientHandler.emit(
      "PlayerState",
      MultiplayerGameInterfaceHandler.playerState
    );
    // MultiplayerGameInterfaceHandler.updatePlayerMesh();
    // MultiplayerGameInterfaceHandler.updateOtherPlayersMesh();
    MultiplayerGameInterfaceHandler.CheckForNewPlayersAndAddThemOrUpdatePositions();

    // MultiplayerTextHandler.update();
  }

  waves.update(time);
  controls.update(time, prevTime);
  renderer.render(scene, camera);
  stats.update();

  //Frame Shut Down
  prevTime = time;
  frameIndex++;
}
