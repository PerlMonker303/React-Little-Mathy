import React, { Component } from "react";

import styles from "./Menu.module.css";
import Data from "../../resources/local.json";
import MenuEntity from "./MenuEntity/MenuEntity";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entities: Data.entities,
    };
  }
  mouseMoveHandler = (event) => {
    console.log(
      "[MOUSE MOVED MENU] dragging:",
      this.props.getIsPlacingEntityFromMenu()
    );
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
    console.log(
      "[MOUSE UP MENU] dragging:",
      this.props.getIsPlacingEntityFromMenu()
    );
    this.setIsDragging(false);
    this.props.setIsPlacingEntityFromMenu(false);
  };
  mouseOutHandler = (event) => {
    console.log(
      "[MOUSE OUT MENU] dragging:",
      this.props.getIsPlacingEntityFromMenu()
    );
    if (this.props.getIsPlacingEntityFromMenu()) {
      this.props.showEntityFromMenu(0);
      this.props.setIsPlacingEntityFromMenu(true);
    }
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
              entity={entity}
              mouse={this.props.mouse}
              setIsDragging={this.props.setIsPlacingEntityFromMenu}
            />
          );
        })}
      </div>
    );
  }
}

export default Menu;
