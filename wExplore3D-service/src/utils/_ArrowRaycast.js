import * as THREE from "/modules/three.module.js";
class _ArrowRaycast {
  constructor(scene, camera) {
    var mouse = { x: 1, y: 1 };
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    let cameraLookDir = function (camera) {
      var vector = new THREE.Vector3(0, 0, -1);
      vector.applyEuler(camera.rotation, camera.rotation.order);
      return vector;
    };
    // console.log("Camera Vec", cameraLookDir(camera));

    let arrow = new THREE.ArrowHelper(
      cameraLookDir(camera),
      camera.position,
      10,
      Math.random() * 0xffffff
    );
    scene.add(arrow);

    const pointer = new THREE.Vector2();
    //Raycast
    let raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, false);

    if (intersects.length > 0) {
      //console.log(intersects)

      intersects.forEach((element) => {
        console.log("intersects", element);
        if (element.object.type == "Mesh") {
          if (element.object.userData.url != undefined) {
            console.log("LABEL & URL DETECTED", element.object);

            // iFrame = createFrame("Sunshine_Policy",
            iFrame = createFrame(
              element.object.userData.url,
              camera.position.x + cameraLookDir(camera).x,
              camera.position.y + cameraLookDir(camera).y,
              camera.position.z + cameraLookDir(camera).z
            );
          }
        }
      });
    } else {
      console.log("Did not intersect anything!");
    }
  }
  update(time, prevTime) {}
}

export { _ArrowRaycast };
