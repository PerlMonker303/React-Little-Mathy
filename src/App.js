import React, { Component } from "react";
import Entity from "./components/Entity/Entity";

import styles from "./App.module.css";
import { render } from "@testing-library/react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouse: [0, 0],
      current_zIndex: 100,
      entities: [
        { id: 1, backgroundColor: "red" },
        { id: 2, backgroundColor: "green" },
        { id: 3, backgroundColor: "blue" },
      ],
    };
  }

  mouseMoveHandler = (event) => {
    this.setState({ mouse: [event.clientX, event.clientY] });
  };
  /* 
  increment_zIndex = () => {
    this.setState((prevProps, prevState) => {
      return {
        ...prevState,
        current_zIndex: prevState.current_zIndex + 1,
      };
    });
  }; */

  render() {
    return (
      <div className={styles.App} onMouseMove={this.mouseMoveHandler}>
        {this.state.entities.map((entity, index) => {
          return (
            <Entity
              key={entity.id}
              mouse={this.state.mouse}
              backgroundColor={entity.backgroundColor}
              current_zIndex={this.state.current_zIndex + index}
            />
          );
        })}
      </div>
    );
  }
}

export default App;
