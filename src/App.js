import React, { Component } from "react";
import ReactDOM from "react-dom";
import Entity from "./components/Entity/Entity";
import Menu from "./components/Menu/Menu";

import styles from "./App.module.css";

import {
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_CHECK,
  COLLISION_DRAGGED,
  COLLISION_MENU,
  COLLISION_OVER_MENU,
} from "./resources/properties";

import {
  createEntity,
  deleteEntity,
  getEntityBasedOnId,
  combineEntities,
} from "./backend/services/EntityService";

import Data from "./resources/local.json";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiResponse: "",
      mouse: [0, 0],
      current_zIndex: 100,
      entities: [],
      somethingIsDragged: false,
      whatIsDragged: null,
      whatIsDraggedFromMenu: null,
      currentKey: 0,
      isPlacingEntityFromMenu: false,
      isOverMenu: false,
      previewEntity: null,
    };
  }

  callAPI = () => {
    fetch("http://localhost:9000/testAPI")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }));
  };

  componentDidMount = () => {
    this.callAPI();
  };

  incrementCurrentKey = () => {
    let newCurrentKey = this.state.currentKey + 1;
    this.setState((prevProps, prevState) => {
      return {
        ...prevState,
        currentKey: newCurrentKey,
      };
    });
  };

  setIsOverMenu = (set) => {
    this.setState((prevProps, prevState) => {
      return {
        ...prevState,
        isOverMenu: set,
      };
    });
  };

  mouseMoveHandler = (event) => {
    const newPreviewEntity = this.state.previewEntity;
    if (newPreviewEntity != null) {
      newPreviewEntity.coordinates = { x: event.clientX, y: event.clientY };
    }
    this.setState({
      mouse: [event.clientX, event.clientY],
      previewEntity: newPreviewEntity,
    });
  };

  collisionDetector = (type) => {
    /*type: 
    -COLLISION_CHECK - just checks for collisions, used to show collision on overlapping items
    -COLLISION_DRAGGED - take action for overlapping elements
    */
    //first check if collision is made with menu
    //-get menu coords
    const menuComponent = ReactDOM.findDOMNode(
      this.refs["MenuRef"]
    ).getBoundingClientRect();

    //-check for menu collision
    if (type === COLLISION_MENU) {
      if (
        this.state.mouse[0] <= menuComponent.x + menuComponent.width &&
        this.state.mouse[1] <= menuComponent.y + menuComponent.height &&
        this.state.mouse[0] >= menuComponent.x &&
        this.state.mouse[1] >= menuComponent.y
      ) {
        return COLLISION_OVER_MENU;
      }
    }

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
            /* console.log("CHECKING"); console.log("[" + entity1.id + "] " + entity1.coordinates.x + ":" + entity1.coordinates.y); console.log(
              "[" + entity2.id + "] " + entity2.coordinates.x + ":" +  entity2.coordinates.y ); */
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

  setWhatIsDragged = (set) => {
    this.setState((prevProps, prevState) => {
      return { ...prevState, whatIsDragged: set };
    });
  };

  setWhatIsDraggedFromMenu = (set) => {
    this.setState((prevProps, prevState) => {
      return { ...prevState, whatIsDraggedFromMenu: set };
    });
  };

  showEntityFromMenu = (entityId) => {
    let idx = -1;
    for (let i = 0; i < Data.entities.length; i++) {
      if (Data.entities[i].id === this.state.whatIsDraggedFromMenu) {
        idx = i;
        break;
      }
    }

    const baseEntity = Data.entities[idx];
    const newEntity = createEntity(
      baseEntity,
      this.state.currentKey,
      this.state.mouse[0],
      this.state.mouse[1]
    );

    this.setState((prevProps, prevState) => {
      return {
        ...prevState,
        previewEntity: newEntity,
      };
    });
  };

  mouseUpHandler = (event) => {
    if (
      this.state.isPlacingEntityFromMenu === false &&
      this.state.somethingIsDragged &&
      this.collisionDetector(COLLISION_MENU) === COLLISION_OVER_MENU
    ) {
      console.log("PLACED TO MENU - ", this.state.whatIsDragged);
      deleteEntity(this.state.entities, this.state.whatIsDragged);
    } else if (
      this.state.isPlacingEntityFromMenu &&
      !this.state.somethingIsDragged
    ) {
      if (this.collisionDetector(COLLISION_MENU) === COLLISION_OVER_MENU) {
        this.setState((prevProps, prevState) => {
          return {
            ...prevState,
            whatIsDraggedFromMenu: null,
            isPlacingEntityFromMenu: null,
            previewEntity: null,
          };
        });
        return;
      }
      console.log("PLACED FROM MENU");
      this.setIsPlacingEntityFromMenu(false);
      let idx = -1;
      for (let i = 0; i < Data.entities.length; i++) {
        if (Data.entities[i].id === this.state.whatIsDraggedFromMenu) {
          idx = i;
          break;
        }
      }
      const baseEntity = Data.entities[idx];
      const newEntity = createEntity(
        baseEntity,
        this.state.currentKey,
        this.state.mouse[0],
        this.state.mouse[1]
      );
      this.incrementCurrentKey();

      const newEntities = this.state.entities;
      newEntities.push(newEntity);

      this.setState((prevProps, prevState) => {
        return { ...prevState, entities: newEntities, previewEntity: null };
      }, this.collisionDetector(COLLISION_DRAGGED));
    }
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
          ref="MenuRef"
          mouse={this.state.mouse}
          showEntityFromMenu={this.showEntityFromMenu}
          setIsPlacingEntityFromMenu={this.setIsPlacingEntityFromMenu}
          getIsPlacingEntityFromMenu={() => this.state.isPlacingEntityFromMenu}
          setWhatIsDraggedFromMenu={this.setWhatIsDraggedFromMenu}
        />
        {this.state.previewEntity ? (
          <Entity
            id={this.state.previewEntity.id}
            mouse={this.state.mouse}
            current_zIndex={1000}
            coordinates={{ x: this.state.mouse[0], y: this.state.mouse[1] }}
            collisionDetector={this.collisionDetector}
            setSomethingIsDragged={this.setSomethingIsDragged}
            setWhatIsDragged={this.setWhatIsDragged}
            icon={this.state.previewEntity.icon}
            setCurrentPreviewPos
          />
        ) : null}
        {this.state.entities.map((entity, index) => {
          return (
            <Entity
              key={entity.keyValue}
              keyValue={entity.keyValue}
              id={entity.id}
              mouse={this.state.mouse}
              backgroundColor={entity.backgroundColor}
              current_zIndex={this.state.current_zIndex + index}
              coordinates={entity.coordinates}
              collisionDetector={this.collisionDetector}
              setSomethingIsDragged={this.setSomethingIsDragged}
              setWhatIsDragged={this.setWhatIsDragged}
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
