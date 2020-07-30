import { ENTITIES_OUTER_PADDING } from "../../resources/properties";
import Data from "../../resources/local.json";
import { discoverEntity } from "../localDataUtils";

export const createEntity = (baseEntity, keyValue, posX, posY) => {
  return {
    id: baseEntity.id,
    keyValue: keyValue,
    backgroundColor: baseEntity.backgroundColor,
    coordinates: {
      x: posX - ENTITIES_OUTER_PADDING / 4,
      y: posY - ENTITIES_OUTER_PADDING / 4,
    },
    isHighlighted: false,
    icon: baseEntity.icon,
  };
};

export const deleteEntity = (entities, entity) => {
  //based on keys, not ids
  let idx = -1;
  for (let i = 0; i < entities.length; i++) {
    if (
      entities[i].id === entity.state.id &&
      entities[i].keyValue === entity.props.keyValue
    ) {
      idx = i;
      break;
    }
  }
  entities.splice(idx, 1);
};

export const getEntityBasedOnId = (entities, id) => {
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].id === id) {
      return entities[i];
    }
  }
  return null;
};

export const combineEntities = (entities, entity1, entity2, keyValue) => {
  /* Combines two entities obtaining a new one
    Input: 
        entities - the current entities in the workspace
        entity1 - the first entity to be combined
        entity2 - the second entity to be combined 
        keyValue - the value of the new key
    Output: true if combined, false otherwise*/

  //first check here if the two entities can be combined
  const childEntity = searchChildEntity(entity1.id, entity2.id);
  console.log("[CHILD]", childEntity);
  if (childEntity !== null) {
    let copy_entities = entities;
    const idx1 = copy_entities.indexOf(entity1);
    const coordOfEntity1 = copy_entities[idx1].coordinates;
    copy_entities.splice(idx1, 1);
    const idx2 = copy_entities.indexOf(entity2);
    copy_entities.splice(idx2, 1);

    //add new entity
    const adaptedEntity = createEntity(childEntity, keyValue);
    adaptedEntity.coordinates = coordOfEntity1;
    copy_entities.push(adaptedEntity);

    //discover it
    discoverNewEntity(adaptedEntity.id);

    return true;
  }
  return false;
};

const discoverNewEntity = (newEntityId) => {
  for (let i = 0; i < Data.entities.length; i++) {
    if (
      Data.entities[i].id === newEntityId &&
      Data.entities[i].discovered === false
    ) {
      console.log("DISCOVERED ", JSON.stringify(Data.entities[i]));
      discoverEntity(i);
      return;
    }
  }
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

export const searchChildEntity = (entity1Id, entity2Id) => {
  /*Searches for the child between two entities
  Input: entity1Id, entity2Id - the IDs of the two entities
  Output: the child entity or null if not found */
  let foundObj = null;
  Data.entities.forEach((entity, idx) => {
    if (foundObj === null) {
      if (
        (entity.parents[0] === entity1Id && entity.parents[1] === entity2Id) ||
        (entity.parents[0] === entity2Id && entity.parents[1] === entity1Id)
      ) {
        foundObj = JSON.parse(JSON.stringify(Data.entities[idx]));
      }
    }
  });
  return foundObj;
};
