import React, { Component } from "react";

import styles from "./Entity.module.css";

class Entity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragged: false,
      coordinates: {
        x: 200,
        y: 200,
      },
      size: {
        width: 100,
        height: 100,
      },
      zIndex: this.props.current_zIndex,
    };
  }
  enterDrag = (event) => {
    event.persist();
    //console.log("[Started drag]");
    const currentX = this.props.mouse[0] - this.state.size.width / 2;
    const currentY = this.props.mouse[1] - this.state.size.height / 2;
    this.setState((prevState, props) => {
      return {
        ...prevState.state,
        isDragged: true,
        coordinates: {
          x: currentX,
          y: currentY,
        },
        zIndex: this.props.current_zIndex + 1,
      };
    });
  };

  exitDrag = (event) => {
    event.persist();
    //console.log("[Stopped drag]");
    const currentX = this.props.mouse[0] - this.state.size.width / 2;
    const currentY = this.props.mouse[1] - this.state.size.height / 2;
    this.setState((prevState, props) => {
      return {
        ...prevState.state,
        isDragged: false,
        coordinates: {
          x: currentX,
          y: currentY,
        },
        zIndex: this.props.current_zIndex - 1,
      };
    });
  };

  mouseMove = (event) => {
    event.persist();
    if (this.state.isDragged) {
      const currentX = this.props.mouse[0] - this.state.size.width / 2;
      const currentY = this.props.mouse[1] - this.state.size.height / 2;
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
  };

  componentDidMount = (prevProps, prevState) => {
    console.log("HERE");
    const currentX = this.props.mouse[0] - this.state.size.width / 2;
    const currentY = this.props.mouse[1] - this.state.size.height / 2;
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

  trigeredEvent = () => {
    console.log("[TRIGGERED]");
  };

  render() {
    /* const currentX = this.props.mouse[0] - this.state.size.width / 2;
    const currentY = this.props.mouse[1] - this.state.size.height / 2; */
    const currentX = this.state.coordinates.x;
    const currentY = this.state.coordinates.y;
    //console.log("[CURRENT]" + currentX + "," + currentY);
    const style = {
      position: "absolute",
      top: currentY,
      left: currentX,
      backgroundColor: this.props.backgroundColor,
      zIndex: this.state.zIndex,
    };

    return (
      <div
        className={styles.Entity}
        style={style}
        onMouseDownCapture={this.enterDrag}
        onMouseUpCapture={this.exitDrag}
        onMouseMove={this.mouseMove}
      ></div>
    );
  }
}

export default Entity;
