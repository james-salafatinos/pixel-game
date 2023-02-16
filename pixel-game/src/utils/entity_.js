// Define an Entity class that will hold components
class Entity {
  constructor() {
    this.components = new Map();
  }

  addComponent(component) {
    this.components.set(component.constructor, component);
  }

  getComponent(Component) {
    return this.components.get(Component);
  }
}
