import * as THREE from "/modules/three.module.js";
import { Octree } from "/modules/Octree.js";
import { OctreeHelper } from "/modules/OctreeHelper.js";
import { Capsule } from "/modules/Capsule.js";

class MultiplayerGameInterface {
  constructor(scene, camera, MultiplayerSubsystemClientHandler) {
    this.scene = scene;
    this.camera = camera;
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;

    this.GameMeshState = {};
    this.GameProjectileMeshState = {};

    this.player;
    // this.PlayerMeshes = [];
    this.playerState = {};
    this.playerProjectileState = {};

    this.vector1 = new THREE.Vector3();
    this.vector2 = new THREE.Vector3();
    this.vector3 = new THREE.Vector3();

    this.GRAVITY = 9.8 ** 2;
    this.NUM_SPHERES = 100;
    this.SPHERE_RADIUS = 2;
    this.STEPS_PER_FRAME = 5;

    this.sphereGeometry = new THREE.IcosahedronGeometry(this.SPHERE_RADIUS, 5);
    this.sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xbbbb44 });

    this.spheres = [];
    this.sphereIdx = 0;

    let mouseTime = 0;

    this.playerVelocity = new THREE.Vector3();
    this.playerDirection = new THREE.Vector3();
    this.playerCollider = new Capsule(
      new THREE.Vector3(0, 0.35, 0),
      new THREE.Vector3(0, 1, 0),
      0.35
    );

    for (let i = 0; i < this.NUM_SPHERES; i++) {
      const sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
      sphere.castShadow = true;
      sphere.receiveShadow = true;

      this.scene.add(sphere);

      this.spheres.push({
        mesh: sphere,
        collider: new THREE.Sphere(
          new THREE.Vector3(0, -100, 0),
          this.SPHERE_RADIUS
        ),
        velocity: new THREE.Vector3(),
      });
    }
  }

  CheckForNewPlayersAndAddThemOrUpdatePositions() {
    if (this.MultiplayerSubsystemClientHandler.gameState != undefined) {
      // console.log("check", this.MultiplayerSubsystemClientHandler.gameState);

      let listOfSocketIDs = Object.keys(
        //ServerGameState
        this.MultiplayerSubsystemClientHandler.gameState
      );

      let listOfDisconnectedSocketIDs =
        this.MultiplayerSubsystemClientHandler.disconnected_ids;

      for (let i = 0; i < listOfSocketIDs.length; i++) {
        //checking in
        const element = listOfSocketIDs[i];
        // console.log(element);

        //
        if (element in this.GameMeshState) {
          // console.log("TRUE");

          if (element != this.MultiplayerSubsystemClientHandler.socket.id) {
            this.GameMeshState[element].position.x =
              this.MultiplayerSubsystemClientHandler.gameState[element].x;
            this.GameMeshState[element].position.y =
              this.MultiplayerSubsystemClientHandler.gameState[element].y;
            this.GameMeshState[element].position.z =
              this.MultiplayerSubsystemClientHandler.gameState[element].z;

            // console.log(
            //   "CAMERA LOOK VEC",
            //   this.MultiplayerSubsystemClientHandler.gameState[element]
            //     .cameraLookVec
            // );
            this.GameMeshState[element].lookAt(
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.x +
                this.MultiplayerSubsystemClientHandler.gameState[element].x,
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.y +
                this.MultiplayerSubsystemClientHandler.gameState[element].y,
              this.MultiplayerSubsystemClientHandler.gameState[element]
                .cameraLookVec.z +
                this.MultiplayerSubsystemClientHandler.gameState[element].z
            );
          }
          if (element == this.MultiplayerSubsystemClientHandler.socket.id) {
            this.GameMeshState[element].position.x = this.camera.position.x;
            this.GameMeshState[element].position.y = this.camera.position.y;
            this.GameMeshState[element].position.z = this.camera.position.z;
            this.GameMeshState[element].material.visible = false;
            this.GameMeshState[element].children[0].material.visible = false;
            this.GameMeshState[element].children[1].material.visible = false;
            // console.log(this.GameMeshState[element]);
          }
        } else {
          console.log("ADDING PLAYER");
          this.GameMeshState[element] = this.createPlayer();
        }
      }

      // console.log("DISCONNECTED IDS", listOfDisconnectedSocketIDs);
      for (let i = 0; i < listOfDisconnectedSocketIDs.length; i++) {
        //checking in
        const element = listOfDisconnectedSocketIDs[i];
        // console.log("DISCONNECTED ID ELEMENT", element);
        // console.log("To be removed", this.GameMeshState[element]);
        this.scene.remove(this.GameMeshState[element]);
      }
    }
  }

  // CheckForNewProjectilesAndAddThemOrUpdateProjectileLaunches() {
  //   if (
  //     this.MultiplayerSubsystemClientHandler.gameProjectileState != undefined
  //   ) {
  //     // console.log("check", this.MultiplayerSubsystemClientHandler.gameProjectileState);
  //   }
  // }
  //     let listOfSocketIDs = Object.keys(
  //       //ServergameProjectileState
  //       this.MultiplayerSubsystemClientHandler.gameProjectileState
  //     );

  //     // let listOfDisconnectedSocketIDs =
  //     //   this.MultiplayerSubsystemClientHandler.disconnected_ids;

  //     for (let i = 0; i < listOfSocketIDs.length; i++) {
  //       //checking in
  //       const element = listOfSocketIDs[i];
  //       // console.log(element);

  //       //
  //       if (element in this.GameProjectileMeshState) {
  //         // console.log("TRUE");
  //         return;
  //       }
  //       if (element == this.MultiplayerSubsystemClientHandler.socket.id) {
  //         return;
  //       }
  //     }

  //     //And lastly, if the replicated object is not in the mesh state, create the mesh object
  //     console.log("ADDING PROJECTILE");
  //     this.GameProjectileMeshState[element] = this.createProjectile();
  //     console.log(this.GameProjectileMeshState, this.gameProjectileState);
  //   }

  //   // // console.log("DISCONNECTED IDS", listOfDisconnectedSocketIDs);
  //   // for (let i = 0; i < listOfDisconnectedSocketIDs.length; i++) {
  //   //   const element = listOfDisconnectedSocketIDs[i];
  //   //   this.scene.remove(this.GameProjectileMeshState[element]);
  //   // }
  // }
  createPlayer() {
    //Three.js
    let mat = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x004ea1),
    });

    let mat2 = new THREE.MeshPhongMaterial({
      wireframe: false,
      transparent: false,
      depthTest: true,
      side: THREE.DoubleSide,
      color: new THREE.Color(0x51dbe8),
    });
    let geo = new THREE.BoxGeometry(10, 10, 10);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = this.camera.position.x;
    mesh.position.y = this.camera.position.y;
    mesh.position.z = this.camera.position.z;

    let sphereGeo = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh = new THREE.Mesh(sphereGeo, mat2);
    sphereMesh.position.x = this.camera.position.x + 3;
    sphereMesh.position.y = this.camera.position.y + 2.5;
    sphereMesh.position.z = this.camera.position.z + 5;

    let sphereGeo2 = new THREE.SphereGeometry(2, 10, 10);
    let sphereMesh2 = new THREE.Mesh(sphereGeo2, mat2);
    sphereMesh2.position.x = this.camera.position.x - 3;
    sphereMesh2.position.y = this.camera.position.y + 2.5;
    sphereMesh2.position.z = this.camera.position.z + 5;

    mesh.attach(sphereMesh);
    mesh.attach(sphereMesh2);
    // sphereMesh.add(mesh);
    // mesh.add(sphereMesh);
    this.scene.add(mesh);

    // this.player = mesh;
    // this.PlayerMeshes.push(mesh);
    console.log("Player Mesh added to scene,", this.player);
    return mesh;
  }

  createProjectile() {
    console.log("GameInterface.js, creatingProjectile()");
    const sphere = this.spheres[this.sphereIdx];

    this.camera.getWorldDirection(this.cameraLookDir(this.camera));

    sphere.collider.center
      .copy(this.camera.position)
      .addScaledVector(
        this.cameraLookDir(this.camera),
        this.playerCollider.radius * 1.5
      );

    // throw the ball with more force if we hold the button longer, and if we move forward

    const impulse =
      15 + 250 * (1 - Math.exp((this.mouseTime - performance.now()) * 0.01));

    sphere.velocity
      .copy(this.cameraLookDir(this.camera))
      .multiplyScalar(impulse);
    sphere.velocity.addScaledVector(this.playerVelocity, 2);

    this.sphereIdx = (this.sphereIdx + 1) % this.spheres.length;
    console.log("GameInterface.js, finished creatingProjctile()", sphere);
  }

  spheresCollisions() {
    for (let i = 0, length = this.spheres.length; i < length; i++) {
      const s1 = this.spheres[i];

      for (let j = i + 1; j < length; j++) {
        const s2 = this.spheres[j];

        const d2 = s1.collider.center.distanceToSquared(s2.collider.center);
        const r = s1.collider.radius + s2.collider.radius;
        const r2 = r * r;

        if (d2 < r2) {
          const normal = this.vector1
            .subVectors(s1.collider.center, s2.collider.center)
            .normalize();
          const v1 = this.vector2
            .copy(normal)
            .multiplyScalar(normal.dot(s1.velocity));
          const v2 = this.vector3
            .copy(normal)
            .multiplyScalar(normal.dot(s2.velocity));

          s1.velocity.add(v2).sub(v1);
          s2.velocity.add(v1).sub(v2);

          const d = (r - Math.sqrt(d2)) / 2;

          s1.collider.center.addScaledVector(normal, d);
          s2.collider.center.addScaledVector(normal, -d);
        }
      }
    }
  }
  updateSpheres = function (deltaTime, worldOctree) {
    // console.log("updateSpheres()", this.spheres);
    this.spheres.forEach((sphere) => {
      sphere.collider.center.addScaledVector(sphere.velocity, deltaTime);

      const result = worldOctree.sphereIntersect(sphere.collider);

      if (result) {
        sphere.velocity.addScaledVector(
          result.normal,
          -result.normal.dot(sphere.velocity) * 1.5
        );
        sphere.collider.center.add(result.normal.multiplyScalar(result.depth));
      } else {
        sphere.velocity.y -= this.GRAVITY * deltaTime;
      }

      const damping = Math.exp(-0.01 * deltaTime) - 1;
      sphere.velocity.addScaledVector(sphere.velocity, damping);

      // playerSphereCollision(sphere);
    });

    this.spheresCollisions();

    for (const sphere of this.spheres) {
      console.log(sphere.collider.center);
      sphere.mesh.position.copy(sphere.collider.center);
    }
  };

  cameraLookDir(camera) {
    var vector = new THREE.Vector3(0, 0, -1);
    vector.applyEuler(camera.rotation, camera.rotation.order);
    return vector;
  }

  updatePlayerState() {
    //DO NOT TOUCH
    this.playerState = {
      socket_id: this.MultiplayerSubsystemClientHandler.socket.id,
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      cameraLookVec: this.cameraLookDir(this.camera),
    };
  }
  updatePlayerProjectileState() {
    console.log(
      "updatePlayerProjectileState(), this.playerProjectileState",
      this.playerProjectileState
    );
    //DO NOT TOUCH
    this.playerProjectileState = {
      socket_id: this.MultiplayerSubsystemClientHandler.socket.id,
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z,
      velocity: 30,
      cameraLookVec: this.cameraLookDir(this.camera),
    };
  }

  // updatePlayerMesh() {
  //   this.player.position.x = this.camera.position.x;
  //   this.player.position.y = this.camera.position.y;
  //   this.player.position.z = this.camera.position.z;
  // }

  updatePlayerMeshes() {
    for (let i = 0; i < PlayerMeshes.length; i++) {
      const element = listOfSocketIDs[i];
      let positions = this.MultiplayerSubsystemClientHandler.gameState[element];
      console.log("POSITIONS", positions);
    }
  }

  updateOtherPlayersMesh() {
    let listOfSocketIDs = Object.keys(
      this.MultiplayerSubsystemClientHandler.gameState
    );
    // console.log(listOfSocketIDs);
    for (let index = 0; index < listOfSocketIDs.length; index++) {
      const element = listOfSocketIDs[index];
      let positions = this.MultiplayerSubsystemClientHandler.gameState[element];
      console.log("POSITIONS", positions);

      this.player.position.x = this.camera.position.x;
      this.player.position.y = this.camera.position.y;
      this.player.position.z = this.camera.position.z;
    }

    // for (let i = 0; i < )
    // if (this.MultiplayerSubsystemClientHandler.socket.id)
  }
}

export { MultiplayerGameInterface };
