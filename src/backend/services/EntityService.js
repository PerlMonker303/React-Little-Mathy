import { ENTITIES_OUTER_PADDING } from "../../resources/properties";

export const combineEntities = (entities, entity1, entity2) => {
  /* Combines two entities obtaining a new one
    Input: 
        entities - the current entities in the workspace
        entity1 - the first entity to be combined
        entity2 - the second entity to be combined 
    Output: -*/

  //first check here if the two entities can be combined
  let copy_entities = entities;
  const idx1 = copy_entities.indexOf(entity1);
  copy_entities.splice(idx1, 1);
  const idx2 = copy_entities.indexOf(entity2);
  copy_entities.splice(idx2, 1);
  //add new entity
};

// utility: calculate current coordinate
export const calculateCurrentCoordinate = (state, type) => {
  switch (type) {
    case "X":
      return (
        state.coordinates.x -
        (state.size.width + ENTITIES_OUTER_PADDING / 2) / 2
      );
    case "Y":
      return (
        state.coordinates.y -
        (state.size.height + ENTITIES_OUTER_PADDING / 2) / 2
      );
    default:
      return;
  }
};
