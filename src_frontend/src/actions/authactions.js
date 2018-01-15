// src/actions/authactions.js
// Actions defined here as functions can be called throughout the app to handle login token,
// logout and token reset
//
// import the initialized dispatcher. Will be used to send actions to all registered stores
// The registered stores can then act on specific actions defined by the 'type' value
import dispatcher from '../dispatcher';

export function setAuthToken(authToken){
    dispatcher.dispatch({
        type: 'SET_TOKEN',
        newtoken: authToken
    });
}

export function resetAuthToken(){
    dispatcher.dispatch({
        type: 'RESET_TOKEN',
    });
    dispatcher.dispatch({
        type: 'FETCH_BUCKETLISTS',
    });
    setTimeout(() => {
        dispatcher.dispatch({
            type: 'LOAD_BUCKETLISTS'
        });
    }, 1000);

}

export function logout(){
    dispatcher.dispatch({
        type: 'LOG_OUT'
    });
}
