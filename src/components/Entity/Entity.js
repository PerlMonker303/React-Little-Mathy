import React, { Component } from "react";

import styles from "./Entity.module.css";

import {
  ENTITIES_LIMIT,
  ENTITIES_OUTER_PADDING,
  ENTITIES_WIDTH,
  ENTITIES_HEIGHT,
  COLLISION_DRAGGED,
} from "../../properties";

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

  // utility: calculate current coordinate
  calculate_currentCoordinate = (type) => {
    switch (type) {
      case "X":
        return (
          this.state.coordinates.x -
          (this.state.size.width + ENTITIES_OUTER_PADDING / 2) / 2
        );
      case "Y":
        return (
          this.state.coordinates.y -
          (this.state.size.height + ENTITIES_OUTER_PADDING / 2) / 2
        );
      default:
        return;
    }
  };

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

  componentDidMount = (prevProps, prevState) => {
    console.log("HERE");
    const currentX = this.calculate_currentCoordinate("X");
    const currentY = this.calculate_currentCoordinate("Y");
    if (this.state.isDragged) {
      this.setState((prevState, props) => {
        return {
          ...prevState.state,
          coordinates: {
            x: currentX,
            y: currentY,
          },
        };
      });
    }
    //console.log("[DONE]" + currentX + "," + currentY);
  };

  render() {
    const currentX = this.calculate_currentCoordinate("X");
    const currentY = this.calculate_currentCoordinate("Y");
    //console.log("[CURRENT]" + currentX + "," + currentY);
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
        ></div>
      </div>
    );
  }
}

export default Entity;
