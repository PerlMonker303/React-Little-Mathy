import React, { Component } from "react";
import Entity from "./components/Entity/Entity";
import Menu from "./components/Menu/Menu";

import styles from "./App.module.css";

import {
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_CHECK,
  COLLISION_DRAGGED,
} from "./resources/properties";

import {
  createEntity,
  combineEntities,
} from "./backend/services/EntityService";

import Data from "./resources/local.json";

class App extends Component {
  constructor(props) {
    super(props);
    const entities = this.setEntities();
    this.state = {
      mouse: [0, 0],
      current_zIndex: 100,
      entities: entities,
      somethingIsDragged: false,
      currentKey: entities.length,
      isPlacingEntityFromMenu: false,
    };
  }

  setEntities = () => {
    let keyValue = 0;
    let newEntities = Data.entities.map((entity) => {
      let createdEntity = createEntity(entity, keyValue);
      keyValue++;
      return createdEntity;
    });

    return newEntities;
  };

  mouseMoveHandler = (event) => {
    this.setState({ mouse: [event.clientX, event.clientY] });
  };

  collisionDetector = (type) => {
    /*type: 
    -COLLISION_CHECK - just checks for collisions, used to show collision on overlapping items
    -COLLISION_DRAGGED - take action for overlapping elements
    */
    //first check if collision is made with menu - TO DO

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
            /* console.log("CHECKING");
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
            ); */
          } else if (type === COLLISION_DRAGGED) {
            console.log("DRAGGED");
            combineEntities(
              this.state.entities,
              entity1,
              entity2,
              this.state.currentKey
            );
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

  showEntityFromMenu = (entityId) => {
    console.log("SHOWING ENTITY WITH ID " + entityId);
  };

  mouseUpHandler = (event) => {
    console.log("PLACED FROM MENU");
    this.setIsPlacingEntityFromMenu(false);
  };

  setIsPlacingEntityFromMenu = (set) => {
    this.setState((prevProps, prevState) => {
      return { ...prevState, isPlacingEntityFromMenu: set };
    });
  };

  render() {
    if (this.state.somethingIsDragged) {
      this.collisionDetector(COLLISION_CHECK);
    }

    return (
      <div
        className={styles.App}
        onMouseMove={this.mouseMoveHandler}
        onMouseUpCapture={this.mouseUpHandler}
      >
        <Menu
          mouse={this.state.mouse}
          showEntityFromMenu={this.showEntityFromMenu}
          setIsPlacingEntityFromMenu={this.setIsPlacingEntityFromMenu}
          getIsPlacingEntityFromMenu={() => this.state.isPlacingEntityFromMenu}
        />
        {this.state.entities.map((entity, index) => {
          return (
            <Entity
              key={entity.key}
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
