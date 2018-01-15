// src/stores/BucketlistStore.js
//
// This class is inherited from EventEmitter. EventEmitter has an 'on' method which can
// be used to detect actions that happen in an instance. 
// Use "this.emit('change')" to declare when an action has occurred.
// When referring to the class,call the class method "on('change', )" and insert some
// function to perform as the second argument.
import { EventEmitter } from 'events';

// import axios to send HTTP requests
import axios from 'axios';

// import dispatcher to register the store
import dispatcher from '../dispatcher';

class BucketlistStore extends EventEmitter{
    constructor(){
        super();
        this.bucketlists = [];
        this.token = "";
        this.bucketlists_url = "http://bucketlistultimaapi.herokuapp.com/bucketlists/"
        this.records_length = 0;
    }

    createBucketlist(payload){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        axios({
            method: 'post',
            url: this.bucketlists_url,
            withCredentials: false,
            headers: {'Authorization': fullToken},
            data: payload
        }).then((response) => {
            this.retrieveBucketlists();
        }).catch((error) => {
            console.log(error);
        });
    }

    getAll(){
        return this.bucketlists;
    }

    flushStore(){
        this.bucketlists = [];
        this.emit('change');
    }

    retrieveBucketlists(queryParams=null){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        let queryURL = "?";        
        if(queryParams !== null && queryParams !== undefined){
            if(queryParams['limit']){
                queryURL = queryURL+"limit="+queryParams['limit'];
            }
            if(queryParams['page'] && queryURL !== "?"){
                queryURL = queryURL+"&page="+queryParams['page'];
            } else if(queryParams['page'] && queryURL === "?")
            {
                queryURL = queryURL+"page="+queryParams['page'];
            }
            if(queryParams['q'] && queryURL !== "?"){
                queryURL = queryURL+"&q="+queryParams['q'];
            } else if(queryParams['q'] && queryURL === "?")
            {
                queryURL = queryURL+"q="+queryParams['q'];
            }
        }

        axios({
            method: 'get',
            url: this.bucketlists_url+queryURL,
            withCredentials: false,
            headers: {'Authorization': fullToken}
        }).then((response) => {
            console.log(response.status);
            this.bucketlists = response.data['bucketlists'];
            this.records_length = response.data['records_length'];
            this.emit('change');
        }).catch((error) => {
            console.log(error);
            this.flushStore();
            if(error.response){
                if(error.response.status === 401){
                    window.location = "/";
                    this.records_length = null;
                    this.emit('change');
                }
            }
        });
    }

    deleteBucketlist(id, page=null){
        const fullToken = 'Bearer ' + localStorage.getItem("token");        
        axios({
            method: 'delete',
            url: this.bucketlists_url+id,
            withCredentials: false,
            headers: {'Authorization': fullToken},
        }).then((response) => {
            this.retrieveBucketlists(page);
        }).catch((error) => {
            console.log(error);
        });
    }

    editBucketlist(id, payload){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        axios({
            method: 'put',
            url: this.bucketlists_url+id,
            withCredentials: false,
            headers: {'Authorization': fullToken},
            data: payload
        }).then((response) => {
            this.retrieveBucketlists();
        }).catch((error) => {
            console.log(error);
        });
    }

    getToken(){
        return localStorage.getItem("token");
    }

    setToken(newtoken){
        localStorage.setItem("token", newtoken);            
        this.token = newtoken;
        this.emit('change');
    }

    logout(){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        axios({
            method: 'post',
            url: 'http://bucketlistultimaapi.herokuapp.com/auth/logout',
            withCredentials: false,
            headers: {'Authorization': fullToken},
        }).then((response) => {
            this.flushStore();
        }).catch((error) => {
            console.log(error);
        });
    }

    handleActions(action){
        switch(action.type){
            case "CREATE_BUCKETLIST": {
                this.createBucketlist(action.payload);
                break;
            }
            case "FETCH_BUCKETLISTS": {
                this.retrieveBucketlists();
                break;
            }
            case "LOAD_BUCKETLISTS": {
                return this.getAll();
            }
            case "DELETE_BUCKETLIST": {
                this.deleteBucketlist(action.id, action.page);
                break;
            }
            case "EDIT_BUCKETLIST": {
                this.editBucketlist(action.id, action.payload);
                break;
            }
            case "SET_TOKEN": {
                this.setToken(action.newtoken);
                break;
            }
            case "RESET_TOKEN": {
                this.setToken(localStorage.getItem("token"));
                break;
            }
            case "LOG_OUT": {
                this.logout();
                break;
            }
            case "SEARCH_BUCKETLIST": {
                this.retrieveBucketlists(action.name);
                break;
            }
            default:{
                break;
            }
        }
    }
}

const bucketlistStore = new BucketlistStore();
dispatcher.register(bucketlistStore.handleActions.bind(bucketlistStore));
export default bucketlistStore;
