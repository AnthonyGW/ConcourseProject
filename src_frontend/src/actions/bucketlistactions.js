// src/actions/bucketlistactions.js
// Actions defined here as functions can be called throughout the app to operate on the bucketlist store
//
// import the initialized dispatcher which will be used to send actions to all registered stores
// The registered stores can then act on specific actions defined by the 'type' value
import dispatcher from '../dispatcher';

export function createBucketlist(payload){
    dispatcher.dispatch({
        type: 'CREATE_BUCKETLIST',
        payload: payload
    });
}

export function deleteBucketlist(id, page){
    dispatcher.dispatch({
        type: 'DELETE_BUCKETLIST',
        id: id,
        page: page
    });
}

export function reloadBucketlists(){
    dispatcher.dispatch({
        type: 'FETCH_BUCKETLISTS',
    });
    setTimeout(() => {
        dispatcher.dispatch({
            type: 'LOAD_BUCKETLISTS'
        });
    }, 1000);
}

export function loadBucketlists(authToken){
    dispatcher.dispatch({
        type: 'LOAD_BUCKETLISTS'
    });
}

export function editBucketlist(id, payload){
    dispatcher.dispatch({
        type: 'EDIT_BUCKETLIST',
        id: id,
        payload: payload
    });
}

export function searchBucketlist(name){
    dispatcher.dispatch({
        type: 'SEARCH_BUCKETLIST',
        name: name
    });
}
