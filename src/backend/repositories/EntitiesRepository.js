import Data from "../../resources/local.json";

export default class EntitiesRepository {
  constructor() {
    this.data = Data.entities;
  }

  getData = () => {
    return this.data;
  };

  addEntity = () => {
    //nothing yet
  };

  removeEntity = () => {
    //nothing yet
  };

  updateEntity = () => {
    //nothing yet
  };
}
