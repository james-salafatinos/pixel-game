//External Libraries
import * as THREE from "/modules/three.module.js";
import Stats from "/modules/stats.module.js";

import { io } from "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.esm.min.js";
import { MultiplayerSubsystemClient } from "/utils/MultiplayerSubsystemClient.js";
import { Player } from "/utils/Player.js";

////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//                              App Start                                     //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

//THREE JS
let time = performance.now();

let camera, scene, renderer;
let stats;
let frameIndex = 0;

//IO / SOCKETS / Mutliplayer
let MultiplayerSubsystemClientHandler;

let cube;

let P;

let StaticReplicatedGameState = {};

init();
animate();

function init() {
  //##############################################################################
  //THREE JS BOILERPLATE
  //##############################################################################
  let createScene = function () {
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader(),
      texture = loader.load("/static/nightsky2.jpg");
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
    document.body.appendChild(renderer.domElement);
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
    camera.layers.enable(1);
  };
  createCamera();

  //##############################################################################
  //Multiplayer
  //##############################################################################
  //IO / SOCKETS / Multiplayer
  MultiplayerSubsystemClientHandler = new MultiplayerSubsystemClient(io);

  //##############################################################################
  //App Specific
  //##############################################################################
  let createCube = function () {
    let geometry = new THREE.BoxGeometry(10, 10, 10);
    let material = new THREE.MeshPhongMaterial({
      color: 0xff3232,
      wireframe: false,
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 20;

    cube = mesh;

    scene.add(mesh);
  };
  createCube();

  window.addEventListener("click", () => {
    console.log("click");

    //Rotation Changed
    cube.rotation.y += Math.PI / 4;

    let r = Math.floor(Math.abs(Math.random() * 100));
    let g = Math.floor(Math.abs(Math.random() * 100));
    let b = Math.floor(Math.abs(Math.random() * 100));

    //Cube Material Color Changed
    cube.material.color = new THREE.Color(`rgb(${r}%, ${g}%, ${b}%)`);
    console.log(cube.material.color);
  });

  P = new Player(scene);
  scene.add(P.mesh);
}

function animate() {
  //Frame Start up
  requestAnimationFrame(animate);

  //Frame Adjustments
  cube.rotation.x += 0.01;

  //Replication
  StaticReplicatedGameState.socket_id =
    MultiplayerSubsystemClientHandler.socket.id;
  // replicatedGameState.cube_rotation = new THREE.Vector3(
  //   cube.rotation.x,
  //   cube.rotation.y,
  //   cube.rotation.z
  // );

  StaticReplicatedGameState.cube_color = cube.material.color.getHexString();

  // replicatedGameState.player_position = P.mesh.position;

  //Multiplayer
  if (frameIndex % 120 == 0) {
    MultiplayerSubsystemClientHandler.emit(StaticReplicatedGameState);
  }

  //Multiplayer
  if (frameIndex % 240 == 0) {
    console.log(
      "ServerState from App",
      MultiplayerSubsystemClientHandler.ServerState
    );
    if (MultiplayerSubsystemClientHandler.ServerState != null) {
      cube.material.color = new THREE.Color(
        MultiplayerSubsystemClientHandler.ServerState.cube_color
      );
    }
  }

  time = performance.now();
  renderer.render(scene, camera);
  stats.update();
  frameIndex += 1;
}
