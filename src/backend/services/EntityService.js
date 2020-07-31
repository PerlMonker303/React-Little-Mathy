import { createRef } from "react";
import {
  ENTITIES_OUTER_PADDING,
  COLLISION_REPULSION_OFFSET,
} from "../../resources/properties";
import { discoverEntity } from "../localDataUtils";

import EntitiesRepository from "../repositories/EntitiesRepository";

const entitiesRepository = new EntitiesRepository();

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
    reference: createRef(),
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
    Output: nr of children obtained*/

  //first check here if the two entities can be combined
  const childEntities = searchChildEntities(entity1.id, entity2.id);

  if (childEntities.length > 0) {
    let copy_entities = entities;
    //remove parents
    const idx1 = copy_entities.indexOf(entity1);
    let coordOfEntity1 = copy_entities[idx1].coordinates;
    copy_entities.splice(idx1, 1);
    const idx2 = copy_entities.indexOf(entity2);
    copy_entities.splice(idx2, 1);

    //add new entities
    childEntities.forEach((childEntity, idx) => {
      const adaptedEntity = createEntity(childEntity, keyValue++);
      coordOfEntity1 = {
        x: coordOfEntity1.x + idx * COLLISION_REPULSION_OFFSET,
        y: coordOfEntity1.y + idx * COLLISION_REPULSION_OFFSET,
      };
      adaptedEntity.coordinates = coordOfEntity1;
      //adaptedEntity.isHighlighted = false;
      copy_entities.push(adaptedEntity);

      //discover it
      discoverNewEntity(adaptedEntity.id);
    });
  }
  return childEntities.length;
};

const discoverNewEntity = (newEntityId) => {
  const entities = entitiesRepository.getData();
  for (let i = 0; i < entities.length; i++) {
    if (entities[i].id === newEntityId && entities[i].discovered === false) {
      console.log("DISCOVERED ", JSON.stringify(entities[i]));
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

export const searchChildEntities = (entity1Id, entity2Id) => {
  /*Searches for the children between two entities
  Input: entity1Id, entity2Id - the IDs of the two entities
  Output: list of children entities */
  let foundChildren = [];
  const entities = entitiesRepository.getData();
  entities.forEach((entity, idx) => {
    console.log("ENTITIES PARENTS: ", entity);
    entity.parents.forEach((parentsPair) => {
      console.log("PARENTS Pair: ", parentsPair);
      if (
        (parentsPair[0] === entity1Id && parentsPair[1] === entity2Id) ||
        (parentsPair[0] === entity2Id && parentsPair[1] === entity1Id)
      ) {
        foundChildren.push(JSON.parse(JSON.stringify(entities[idx])));
      }
    });
  });
  return foundChildren;
};
