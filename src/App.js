import React, { Component } from "react";
import Entity from "./components/Entity/Entity";

import styles from "./App.module.css";

import {
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_CHECK,
  COLLISION_DRAGGED,
} from "./resources/properties";

import { combineEntities } from "./backend/services/EntityService";

import Data from "./resources/local.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouse: [0, 0],
      current_zIndex: 100,
      entities: Data.entities.map((entity) => {
        console.log(entity);
        return {
          id: entity.id,
          backgroundColor: entity.backgroundColor,
          coordinates: { x: entity.id * 100, y: entity.id * 100 },
          isHighlighted: false,
          icon: entity.icon,
        };
      }),
      somethingIsDragged: false,
      /* [
        {
          id: 1,
          backgroundColor: "red",
          coordinates: { x: 30, y: 50 },
          isHighlighted: false,
        },
        {
          id: 2,
          backgroundColor: "green",
          coordinates: { x: 100, y: 120 },
          isHighlighted: false,
        },
        {
          id: 3,
          backgroundColor: "blue",
          coordinates: { x: 150, y: 180 },
          isHighlighted: false,
        },
      ], */
    };
  }

  mouseMoveHandler = (event) => {
    this.setState({ mouse: [event.clientX, event.clientY] });
  };

  collisionDetector = (type) => {
    /*type: 
    -COLLISION_CHECK - just checks for collisions, used to change color on collision items
    -COLLISION_DRAGGED - take action for overlapping elements
    */
    for (let i = 0; i < this.state.entities.length; i++) {
      for (let j = i + 1; j < this.state.entities.length; j++) {
        const entity1 = this.state.entities[i];
        const entity2 = this.state.entities[j];
        entity1.isHighlighted = false;
        entity2.isHighlighted = false;

        //code for collision

        if (
          (entity1.coordinates.x <=
            entity2.coordinates.x + ENTITIES_WIDTH / 2 &&
            entity1.coordinates.y <=
              entity2.coordinates.y + ENTITIES_HEIGHT / 2 &&
            entity1.coordinates.x + ENTITIES_WIDTH / 2 >=
              entity2.coordinates.x &&
            entity1.coordinates.y + ENTITIES_HEIGHT / 2 >=
              entity2.coordinates.y) ||
          (entity2.coordinates.x <=
            entity1.coordinates.x + ENTITIES_WIDTH / 2 &&
            entity2.coordinates.y <=
              entity1.coordinates.y + ENTITIES_HEIGHT / 2 &&
            entity2.coordinates.x + ENTITIES_WIDTH / 2 >=
              entity1.coordinates.x &&
            entity2.coordinates.y + ENTITIES_HEIGHT / 2 >=
              entity1.coordinates.y)
        ) {
          if (type === COLLISION_CHECK) {
            console.log("CHECKING");
            console.log(
              "[" +
                entity1.id +
                "] " +
                entity1.coordinates.x +
                ":" +
                entity1.coordinates.y
            );
            console.log(
              "[" +
                entity2.id +
                "] " +
                entity2.coordinates.x +
                ":" +
                entity2.coordinates.y
            );
          } else if (type === COLLISION_DRAGGED) {
            console.log("DRAGGED");
            combineEntities(this.state.entities, entity1, entity2);
          }

          entity1.isHighlighted = true;
          entity2.isHighlighted = true;
          return;
        }
      }
    }
  };

  setSomethingIsDragged = (set) => {
    this.setState((prevProps, prevState) => {
      return { ...prevState, somethingIsDragged: set };
    });
  };

  render() {
    if (this.state.somethingIsDragged) {
      this.collisionDetector(COLLISION_CHECK);
    }

    return (
      <div className={styles.App} onMouseMove={this.mouseMoveHandler}>
        {this.state.entities.map((entity, index) => {
          return (
            <Entity
              key={entity.id}
              mouse={this.state.mouse}
              backgroundColor={entity.backgroundColor}
              current_zIndex={this.state.current_zIndex + index}
              coordinates={entity.coordinates}
              collisionDetector={this.collisionDetector}
              setSomethingIsDragged={this.setSomethingIsDragged}
              isHighlighted={entity.isHighlighted}
              icon={entity.icon}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
