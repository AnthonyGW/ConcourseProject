import React from 'react';
import 'jest-enzyme';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import { expect as chaiexpect } from 'chai';
// import expect from 'expect';

import Adapter from 'enzyme-adapter-react-16';

import BucketlistStore from '../stores/BucketlistStore.js';
import ItemStore from '../stores/ItemStore.js';

Enzyme.configure({ adapter: new Adapter() });

it('returns lists', ()=>{
    const wrapper = BucketlistStore.getAll();
    let empty_array = [];
    expect(wrapper).toEqual(empty_array);
});

it('handles actions', ()=>{
    let wrapper = BucketlistStore.handleActions('CREATE_BUCKETLIST');
    expect(wrapper).toEqual(undefined);
});

it('creates lists', ()=>{
    let wrapper = BucketlistStore.createBucketlist({none: null});
    expect(wrapper).toEqual(undefined);
});

it('deletes lists', ()=>{
    let wrapper = BucketlistStore.deleteBucketlist(0,{none: null});
    expect(wrapper).toEqual(undefined);
});

it('edits lists', ()=>{
    let wrapper = BucketlistStore.editBucketlist(0,{none: null});
    expect(wrapper).toEqual(undefined);
});

it('flushes the store', ()=>{
    let wrapper = BucketlistStore.flushStore();
    expect(wrapper).toEqual(undefined);
});

it('retrieves lists', ()=>{
    let wrapper = BucketlistStore.retrieveBucketlists();
    expect(wrapper).toEqual(undefined);
});

it('sets a token', ()=>{
    let wrapper = BucketlistStore.setToken('0');
    expect(wrapper).toEqual(undefined);
});

it('logs out user', ()=>{
    let wrapper = BucketlistStore.logout();
    expect(wrapper).toEqual(undefined);
});

it('returns items', ()=>{
    const wrapper = ItemStore.getAll();
    let empty_array = [];
    expect(wrapper).toEqual(empty_array);
});

it('returns url', ()=>{
    const wrapper = ItemStore.getUrl();
    let empty_url = "";
    expect(wrapper).toEqual(empty_url);
});

it('returns list name', ()=>{
    const wrapper = ItemStore.getName();
    let default_name = "";
    expect(wrapper).toEqual(default_name);
});

it('returns list id', ()=>{
    const wrapper = ItemStore.getId();
    let default_id = "";
    expect(wrapper).toEqual(default_id);
});

it('flushes the store', ()=>{
    let wrapper = ItemStore.flushStore();
    expect(wrapper).toEqual(undefined);
});

it('retrieves items', ()=>{
    let wrapper = ItemStore.retrieveItems("", "", {none: null});
    expect(wrapper).toEqual(undefined);
});

it('handles actions', ()=>{
    let wrapper = ItemStore.handleActions('CREATE_ITEM');
    expect(wrapper).toEqual(undefined);
});

it('creates items', ()=>{
    let wrapper = ItemStore.createItem("", "", {none: null});
    expect(wrapper).toEqual(undefined);
});

it('edits items', ()=>{
    let wrapper = ItemStore.editItem("", "", {none: null});
    expect(wrapper).toEqual(undefined);
});

it('deletes items', ()=>{
    let wrapper = ItemStore.deleteItem("");
    expect(wrapper).toEqual(undefined);
});
