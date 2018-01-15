// src/actions/itemactions.js
// Actions defined here as functions can be called throughout the app to operate on the bucketlist
// item store
//
// import the initialized dispatcher which will be used to send actions to all registered stores
// The registered stores can then act on specific actions defined by the 'type' value
import dispatcher from '../dispatcher';

export function createItem(payload){
    dispatcher.dispatch({
        type: 'CREATE_ITEM',
        payload: payload
    });
}

export function deleteItem(item_id, page){
    dispatcher.dispatch({
        type: 'DELETE_ITEM',
        id: item_id,
        page: page
    });
}

export function reloadItems(id, name){
    dispatcher.dispatch({
        type: 'FETCH_ITEMS',
        id: id,
        name: name
    });
    setTimeout(() => {
        dispatcher.dispatch({
            type: 'LOAD_ITEMS'
        });
    }, 1000);
}

export function loadItems(authToken){
    dispatcher.dispatch({
        type: 'LOAD_ITEMS'
    });
}

export function editItem(item_id, payload){
    dispatcher.dispatch({
        type: 'EDIT_ITEM',
        id: item_id,
        payload: payload
    })
}

export function searchItem(name){
    dispatcher.dispatch({
        type: 'SEARCH_ITEM',
        name: name
    });
}
