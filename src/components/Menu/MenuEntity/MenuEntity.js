import React, { Component } from "react";

import styles from "./MenuEntity.module.css";

class MenuEntity extends Component {
  constructor(props) {
    super(props);
    this.state = { id: this.props.id };
  }

  enterDrag = (event) => {
    event.persist();
    this.props.setIsDragging(true);
    this.props.setWhatIsDragging(this);
  };

  exitDrag = (event) => {
    event.persist();
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
