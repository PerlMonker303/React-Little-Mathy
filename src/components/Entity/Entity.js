import React, { Component } from "react";

import styles from "./Entity.module.css";

import {
  ENTITIES_LIMIT,
  ENTITIES_OUTER_PADDING,
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_DRAGGED,
} from "../../resources/properties";

import { calculateCurrentCoordinate } from "../../backend/services/EntityService";

class Entity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragged: false,
      coordinates: {
        x: this.props.coordinates.x,
        y: this.props.coordinates.y,
      },
      size: {
        width: ENTITIES_WIDTH,
        height: ENTITIES_HEIGHT,
      },
      zIndex: this.props.current_zIndex,
    };
  }

  enterDrag = (event) => {
    event.persist();
    //console.log("[Started drag]");
    const currentX = this.props.mouse[0] - ENTITIES_OUTER_PADDING / 4;
    const currentY = this.props.mouse[1] - ENTITIES_OUTER_PADDING / 4;
    this.setState((prevState, props) => {
      return {
        ...prevState.state,
        isDragged: true,
        coordinates: {
          x: currentX,
          y: currentY,
        },
        zIndex: this.props.current_zIndex + ENTITIES_LIMIT,
      };
    }, this.props.setSomethingIsDragged(true));
  };

  exitDrag = (event) => {
    event.persist();
    //console.log("[Stopped drag]");
    const currentX = this.props.mouse[0] - ENTITIES_OUTER_PADDING / 4;
    const currentY = this.props.mouse[1] - ENTITIES_OUTER_PADDING / 4;
    this.setState(
      (prevProps, prevState) => {
        return {
          ...prevState.state,
          isDragged: false,
          coordinates: {
            x: currentX,
            y: currentY,
          },
          zIndex: this.props.current_zIndex,
        };
      },
      () => {
        this.props.collisionDetector(COLLISION_DRAGGED);
        this.props.setSomethingIsDragged(false);
      }
    );
  };

  mouseMove = (event) => {
    event.persist();
    if (this.state.isDragged) {
      const currentX = this.props.mouse[0] - ENTITIES_OUTER_PADDING / 4;
      const currentY = this.props.mouse[1] - ENTITIES_OUTER_PADDING / 4;
      this.setState((prevState, props) => {
        return {
          ...prevState.state,
          coordinates: {
            x: currentX,
            y: currentY,
          },
        };
      });
      this.props.coordinates.x = this.state.coordinates.x;
      this.props.coordinates.y = this.state.coordinates.y;
    }
  };

  render() {
    const currentX = calculateCurrentCoordinate(this.state, "X");
    const currentY = calculateCurrentCoordinate(this.state, "Y");

    const InnerStyle = {
      backgroundColor: this.props.backgroundColor,
      zIndex: this.state.zIndex,
      width: this.state.size.width,
      height: this.state.size.height,
      marginTop: ENTITIES_OUTER_PADDING / 2,
      marginLeft: ENTITIES_OUTER_PADDING / 2,
      opacity: this.props.isHighlighted ? 0.6 : 1,
    };

    const OuterStyle = this.state.isDragged
      ? {
          position: "absolute",
          top: currentY,
          left: currentX,
          zIndex: ENTITIES_LIMIT,
          width: this.state.size.width + ENTITIES_OUTER_PADDING,
          height: this.state.size.height + ENTITIES_OUTER_PADDING,
        }
      : {
          position: "absolute",
          top: currentY,
          left: currentX,
          width: 0,
          height: 0,
        };

    return (
      <div
        className={styles.OuterEntity}
        style={OuterStyle}
        onMouseDownCapture={this.state.isDragged ? this.enterDrag : null}
        onMouseMove={this.mouseMove}
      >
        <div
          className={styles.Entity}
          style={InnerStyle}
          onMouseDownCapture={this.enterDrag}
          onMouseUpCapture={this.exitDrag}
        >
          <img
            src={require("../../resources/icons/" + this.props.icon)}
            alt={this.props.icon}
          />
        </div>
      </div>
    );
  }
}

export default Entity;
