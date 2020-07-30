import Data from "../resources/local.json";

var fs = require("browserify-fs");

export const discoverEntity = (idx) => {
  let newData = Data;
  newData.entities[idx].discovered = true;
  //fs.writeFile(`../resources/local.json`, JSON.parse(JSON.stringify(Data)));
  fs.writeFile("../resources/local.json", "text", () => {
    alert("done");
  });
};
