import * as THREE from "/modules/three.module.js";
class entityManager {
  constructor() {
    this._ids = 0;
    this.entities = [];
    this.entitiesMap = [];
  }
  _GenerateName() {
    this._ids += 1;
    return "__name__" + this._ids;
  }

  Add(e, n) {
    if (!n) {
      n = this._GenerateName();
    }
    this.entitiesMap[n] = e;
    this.entities.push(e);
  }
}

export { entityManager };
