import * as THREE from "/modules/three.module.js";

class MultiplayerText {
  constructor(
    window,
    scene,
    camera,
    MultiplayerSubsystemClientHandler,
    document
  ) {
    this.scene = scene;
    this.camera = camera;
    this.MultiplayerSubsystemClientHandler = MultiplayerSubsystemClientHandler;
    this._pressedT;

    window.addEventListener("keydown", (event) => {
      switch (event.code) {
        case "KeyT":
          console.log("Pressed t");
          const input = document.getElementById("spell");
          input.focus();
          this._pressedT = true;
          break;

        // case "Ctrl":
        //   console.log("pressed keyN");
        //   if (this._pressedT) {
        //     const input = document.getElementById("spell");
        //     input.blur();
        //     this._pressedT = false;
        //     break;
        //   }

        case "Enter":
          console.log("pressed enter");
          if (this._pressedT) {
            const input = document.getElementById("spell");
            input.blur();
            this._pressedT = false;
            break;
          }
      }
    });
  }
}

export { MultiplayerText };
