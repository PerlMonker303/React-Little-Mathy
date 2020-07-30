import React, { Component } from "react";

import styles from "./Menu.module.css";
import Data from "../../resources/local.json";
import MenuEntity from "./MenuEntity/MenuEntity";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: this.getDiscoveredEntities(),
      isDragging: -1, //id of what is dragged, -1 for nothing
    };
  }

  getDiscoveredEntities = () => {
    let discoveredEntities = [];
    Data.entities.forEach((entity) => {
      if (entity.discovered) {
        discoveredEntities.push(entity);
      }
    });
    return discoveredEntities;
  };

  mouseMoveHandler = (event) => {
    /* console.log(
      "[MOUSE MOVED MENU] dragging:",
      this.props.getIsPlacingEntityFromMenu()
    ); */
  };

  setIsDragging = (set) => {
    this.setState((prevProps, prevState) => {
      return {
        ...prevState,
        isDragging: set,
      };
    });
  };

  mouseUpHandler = (event) => {
    /* console.log(
      "[MOUSE UP MENU] dragging:",
      this.props.getIsPlacingEntityFromMenu()
    ); */
    this.setIsDragging(-1);
    this.props.setIsPlacingEntityFromMenu(false);
  };

  mouseOutHandler = (event) => {
    if (this.props.getIsPlacingEntityFromMenu()) {
      this.props.setIsPlacingEntityFromMenu(true);
      this.props.showEntityFromMenu(this.state.isDragging);
    }
  };

  setWhatIsDragging = (entity) => {
    this.setIsDragging(entity.state.id);
    this.props.setWhatIsDraggedFromMenu(entity.state.id);
  };

  render() {
    return (
      <div
        className={styles.Menu}
        onMouseMoveCapture={this.mouseMoveHandler}
        onMouseUpCapture={this.mouseUpHandler}
        onMouseOutCapture={this.mouseOutHandler}
      >
        {this.state.entities.map((entity) => {
          return (
            <MenuEntity
              key={entity.id}
              id={entity.id}
              entity={entity}
              mouse={this.props.mouse}
              setIsDragging={this.props.setIsPlacingEntityFromMenu}
              setWhatIsDragging={this.setWhatIsDragging}
            />
          );
        })}
      </div>
    );
  }
}

export default Menu;
