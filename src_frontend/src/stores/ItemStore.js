// src/stores/ItemStore.js
//
// This class is inherited from EventEmitter. EventEmitter has an 'on' method which can
// be used to detect actions that happen in an instance. 
// Use "this.emit('change')" to declare when an action has occurred.
// When referring to the class,call the class method "on('change', )" and insert some
// function to perform as the second argument.
import { EventEmitter } from 'events';

// import axios to send HTTP requests
import axios from 'axios';

import dispatcher from '../dispatcher';

class ItemStore extends EventEmitter{

    constructor(){
        super();
        this.items = [];
        this.token = "";
        this.bucketlist_id = "";
        this.bucketlist_name = "";
        this.bucketlists_url = "http://bucketlistultimaapi.herokuapp.com/bucketlists/";
        this.url = "";
        this.records_length = 0;
    }

    createItem(token, payload){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        axios({
            method: 'post',
            url: this.url,
            withCredentials: false,
            headers: {'Authorization': fullToken},
            data: payload
        }).then((response) => {
            console.log(response.data);
            this.retrieveItems(token);
        }).catch((error) => {
            console.log(error);
        });
    }

    // return all bucketlist items that were retrieved by the api
    getAll(){
        return this.items;
    }

    getUrl(){
        return this.url;
    }

    getName(){
        return this.bucketlist_name;
    }

    getId(){
        return this.bucketlist_id;
    }

    flushStore(){
        this.items = [];
        this.emit('change');
    }

    retrieveItems(id, name, queryParams=null){
        const fullToken = 'Bearer ' + localStorage.getItem("token");
        this.bucketlist_id = localStorage.getItem('list_id');
        this.bucketlist_name = name;
        this.url = this.bucketlists_url+this.bucketlist_id+'/items';
        
        let queryURL = "?";
        // if query parameters exist, add them to the url in order of
        // their type i.e limit -> page -> q.
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
            url: this.url+queryURL,
            withCredentials: false,
            headers: {'Authorization': fullToken}
        }).then((response) => {
            this.items = response.data['items'];
            this.records_length = response.data['records_length'];            
            this.emit('change');
        }).catch((error) => {
            console.log(error);
        });
    }

    deleteItem(item_id, page=null){
        const fullToken = 'Bearer ' + localStorage.getItem("token");        
        axios({
            method: 'delete',
            url: this.url+"/"+item_id,
            withCredentials: false,
            headers: {'Authorization': fullToken},
        }).then((response) => {
            console.log(response.data);
            this.retrieveItems(this.bucketlist_id, this.bucketlist_name, page);
            window.location = "/bucketlists/"+this.bucketlist_id+"/items"
        }).catch((error) => {
            console.log(error);
        });
    }

    editItem(token, item_id, payload){
        const fullToken = 'Bearer ' + localStorage.getItem("token");        
        axios({
            method: 'put',
            url: this.url+"/"+item_id,
            withCredentials: false,
            headers: {'Authorization': fullToken},
            data: payload
        }).then((response) => {
            console.log(response.data);
            this.retrieveItems(this.bucketlist_id, this.bucketlist_name);
        }).catch((error) => {
            console.log(error);
        });
    }

    handleActions(action){
        switch(action.type){
            case "CREATE_ITEM": {
                this.createItem(localStorage.getItem("token"), action.payload);
                break;
            }
            case "FETCH_ITEMS": {
                this.retrieveItems(action.id, action.name);
                break;
            }
            case "LOAD_ITEMS": {
                return this.getAll();
            }
            case "DELETE_ITEM": {
                this.deleteItem(action.id, action.page);
                break;
            }
            case "EDIT_ITEM": {
                this.editItem(localStorage.getItem("token"), action.id, action.payload);
                break;
            }
            case "SEARCH_ITEM": {
                this.retrieveItems(this.bucketlist_id, this.bucketlist_name, action.name);
                break;
            }
            default:{
                break;
            }
        }
    }
}

const itemStore = new ItemStore();
dispatcher.register(itemStore.handleActions.bind(itemStore));
export default itemStore;
