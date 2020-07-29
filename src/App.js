import React, { Component } from "react";
import Entity from "./components/Entity/Entity";

import styles from "./App.module.css";
import { render } from "@testing-library/react";
import { ENTITIES_WIDTH, ENTITIES_HEIGHT } from "./properties";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouse: [0, 0],
      current_zIndex: 100,
      entities: [
        { id: 1, backgroundColor: "red", coordinates: { x: null, y: null } },
        { id: 2, backgroundColor: "green", coordinates: { x: null, y: null } },
        { id: 3, backgroundColor: "blue", coordinates: { x: null, y: null } },
      ],
    };
  }

  mouseMoveHandler = (event) => {
    this.setState({ mouse: [event.clientX, event.clientY] });
  };

  collisionDetector = () => {
    for (let i = 0; i < this.state.entities.length; i++) {
      for (let j = i + 1; j < this.state.entities.length; j++) {
        const entity1 = this.state.entities[i];
        const entity2 = this.state.entities[j];
        //code for collision
        if (entity1.coordinates.x === entity2.coordinates.x) {
          console.log("S");
        }
      }
    }
  };

  render() {
    return (
      <div className={styles.App} onMouseMove={this.mouseMoveHandler}>
        {this.state.entities.map((entity, index) => {
          console.log(
            entity.id + ", " + entity.coordinates.x + ":" + entity.coordinates.y
          );
          this.collisionDetector();
          return (
            <Entity
              key={entity.id}
              mouse={this.state.mouse}
              backgroundColor={entity.backgroundColor}
              current_zIndex={this.state.current_zIndex + index}
              coordinates={entity.coordinates}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
