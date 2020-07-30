import React, { Component } from "react";

import styles from "./MenuEntity.module.css";

import {
  ENTITIES_LIMIT,
  ENTITIES_OUTER_PADDING,
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_DRAGGED,
} from "../../../resources/properties";

class MenuEntity extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  enterDrag = (event) => {
    event.persist();
    console.log("[Started drag MENU]");
    this.props.setIsDragging(true);
  };

  exitDrag = (event) => {
    event.persist();
    console.log("[Stopped drag MENU - ON ELEMENT]");
    this.props.setIsDragging(false);
  };

  render() {
    return (
      <div
        className={styles.MenuEntity}
        onMouseDownCapture={this.enterDrag}
        onMouseUpCapture={this.exitDrag}
      >
        <img
          src={require("../../../resources/icons/" + this.props.entity.icon)}
          alt={this.props.entity.icon}
          draggable={false}
        />
        <span>{this.props.entity.name}</span>
      </div>
    );
  }
}

export default MenuEntity;
