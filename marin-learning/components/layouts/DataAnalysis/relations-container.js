

import { useReducer } from "react";
import { appConfig, relationsData } from "~/data/db";

function reducer(relations, action) {
    switch (action.type) {
        case 'ADD': {
            const r = action.relation;
            appConfig.relations.add({name: r.name, attributes: r.attributes});
            relationsData.addRelation(r);

            return [...relations, action.relation];
        }
        case 'REMOVE': {
            return relations.filter(r => r.name !== action.relationName);
        }
        default:
            throw new Error();
    }
}

function processPending(pendingLoads, action) {
    console.log("Processing pending", pendingLoads, action);

    switch (action.type) {
        case 'ADD': {
            return [...pendingLoads, { name: action.relationName }];
        }
        case 'REMOVE': {
            return pendingLoads.filter(r => r.name !== action.relationName);
        }
        default:
            throw new Error();
    }
}

export function useRelationsContainer(initialList = []) {

    const [relations, dispatch] = useReducer(reducer, initialList);
    const [pendingLoads, confirmDispatch] = useReducer(processPending, []);

    function add(r, ignore) {
        if (!ignore && relations.find(rel => rel.name === r.name)) {
            confirmDispatch({
                type: "ADD",
                relationName: r.name
            })
        } else {
            dispatch({
                type: "ADD",
                relation: r
            });
            if (ignore) {
                confirmDispatch({
                    type: "REMOVE",
                    relationName: r.name
                });
            }
        }
    }

    function remove(r) {
        dispatch({
            type: "REMOVE",
            relationName: r
        });
    }

    function ignore(r) {
        confirmDispatch({
            type: "REMOVE",
            relationName: r
        });
    }

    return [relations, add, remove, pendingLoads, ignore];
}
