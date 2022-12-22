const {
  contextBridge,
  ipcRenderer,
  desktopCapturer,
  electronScreen,
  shell,
} = require("electron");

// const electron = require('electron')
// const desktopCapturer = electron.desktopCapturer
// const electronScreen = electron.screen
// const shell = electron.shell

const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");

/*
##########################################################################################

Globals

##########################################################################################
*/

var webcamInput;
var classes = [];
var runs = 0;

/*
##########################################################################################

Accessible in mainProcess

##########################################################################################
*/
contextBridge.exposeInMainWorld("api", {
  close: () => {
    ipcRenderer.send("close-app");
  },
  passthru: () => {
    ipcRenderer.send("passthru");
  },
  block: () => {
    ipcRenderer.send("block");
  },
  blockHold: () => {
    ipcRenderer.send("blockHold");
  },
  addCustomClass: (class_label) => {
    let img;
    img = tf.browser.fromPixels(webcamInput);
    const activation = mobilenetModel.infer(img, "conv_preds");
    knnClassifierModel.addExample(activation, class_label);
  },
  UserPrompt: () => {
    ipcRenderer.send("UserPrompt");
  },

  ScreenShot: (start_left, start_top, W, H) => {
    /*
        Calls upon desktop capturer to get the sources, 
        uses the tf.browser.fromPixels to get a tensor screenshot, 
        then uses the tfjs-node library to encode the png and save it
        */
    // let source_list;

    // desktopCapturer.getSources({
    //     types: ['window', 'screen']
    // }).then((source_id_list) => {
    //     console.log('API.js desktopCapturer', source_id_list)

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then((sources) => {
        // document.getElementById('screenshot-image').src = sources[0].thumbnail.toDataURL() // The image to display the screenshot
        console.log(
          "GRABBED SOURCES, NOW STARTING SREENSHOT",
          start_left,
          start_top,
          W,
          H
        );
        const screenshotPath = `screenshot_tmp`;

        let screenshot_img;
        screenshot_img = tf.browser.fromPixels(webcamInput);
        let screenshot_img2 = sources[0].thumbnail.toPNG();
        console.log(screenshot_img);
        console.log(screenshot_img2);

        backend.node
          .encodePng(screenshot_img)
          .then((f) => {
            fs.writeFileSync(`${screenshotPath}.png`, f);
            console.log(`png written at ${screenshotPath}.png`);
          })
          .then((z) => {
            console.log(z);
            sharp(`./${screenshotPath}.png`)
              .extract({
                left: start_left,
                top: start_top,
                width: W,
                height: H,
              })
              .toFile(`${screenshotPath}.cropped.png`, function (err) {
                if (err) console.log(err);
              });
          });
      });
  },

  stream: () => {
    //Start Capture
    desktopCapturer
      .getSources({
        types: ["window", "screen"],
      })
      .then((source_id_list) => {
        console.log("API.js desktopCapturer", source_id_list);

        // selectSource(source_id_list[2])
        console.log("Passing to start predicting", source_id_list[0]);
        start_predicting(source_id_list[0]);
      });

    async function start_predicting(source) {
      console.log("Begin stream() in api.js");
      //Async to setup machine learning
      async function initialize() {
        const createKNNClassifier = async () => {
          console.log("Loading KNN Classifier!");
          return await knnClassifier.create();
        };

        webcamInput = await createWebcamInput();
      }

      // Get the available video sources and return video element
      async function sourceScreen(source) {
        const constraints = {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: source.id,
            },
          },
        };

        //Claim the html element
        const videoElement = document.getElementById("video");

        //Point the chromium/hardware connection
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        videoElement.play();
        return videoElement;
      }

      await initialize();
      await imageClassificationWithTransferLearningOnWebcam(source);
    }

    // // Get the available video sources
    // async function selectSource(source) {
    //     const constraints = {
    //         audio: false,
    //         video: {
    //             mandatory: {
    //                 chromeMediaSource: 'desktop',
    //                 chromeMediaSourceId: source.id
    //             },
    //         }
    //     };

    //     //To Check devices
    //     // navigator.mediaDevices.enumerateDevices().then((d) => {
    //     //     console.log(d)
    //     // })
    //     const videoElement = document.getElementById('video');
    //     const stream = await navigator.mediaDevices.getUserMedia(constraints)
    //     videoElement.srcObject = stream;
    //     videoElement.play();
    // }
  },
});
