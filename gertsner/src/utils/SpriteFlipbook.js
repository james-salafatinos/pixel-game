import * as THREE from "/modules/three.module.js";
/**
 * This class provides to functionality to animate sprite sheets.
 */
export class SpriteFlipbook {
  constructor(spriteTexture, scene) {
    this.tilesHoriz = 10;
    this.tilesVert = 6;
    this.currentTile = 24;
    this.scene = scene;
    this.map = THREE.Texture;
    this.maxDisplayTime = 5;
    this.elapsedTime = 5;
    this.runningTileArrayInd;
    this.playSpriteIndices = [];
    this.sprite = THREE.Sprite;

    this.map = new THREE.TextureLoader().load(spriteTexture);
    this.map.magFilter = THREE.NearestFilter; // sharp pixel sprite
    this.map.repeat.set(1 / this.tilesHoriz, 1 / this.tilesVert);

    const offsetX = (this.currentTile % this.tilesHoriz) / this.tilesHoriz;
    const offsetY =
      (this.tilesVert - Math.floor(this.currentTile / this.tilesHoriz) - 1) /
      this.tilesVert;

    this.map.offset.x = offsetX;
    this.map.offset.y = offsetY;

    const material = new THREE.SpriteMaterial({ map: this.map });

    this.sprite = new THREE.Sprite(material);
    this.sprite.scale.set(20, 20, 1);
    this.sprite.position.y += 10;

    this.scene.add(this.sprite);
  }
}
