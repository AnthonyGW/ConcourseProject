import React from 'react';
import 'jest-enzyme';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import * as authactions from '../actions/authactions.js';
import * as bucketlistactions from '../actions/bucketlistactions.js';
import * as itemactions from '../actions/itemactions.js';

Enzyme.configure({ adapter: new Adapter() });

it('dispatches authentication actions', ()=>{
    let wrapper = authactions.logout();
    expect(wrapper).toEqual(undefined);
    wrapper = authactions.resetAuthToken();
    expect(wrapper).toEqual(undefined);
    wrapper = authactions.setAuthToken("");
    expect(wrapper).toEqual(undefined);
});

it('dispatches bucketlist actions', ()=>{
    let wrapper = bucketlistactions.createBucketlist({none: null});
    expect(wrapper).toEqual(undefined);
    wrapper = bucketlistactions.deleteBucketlist("", 0);
    expect(wrapper).toEqual(undefined);
    wrapper = bucketlistactions.editBucketlist("", {none: null});
    expect(wrapper).toEqual(undefined);
    wrapper = bucketlistactions.loadBucketlists("");
    expect(wrapper).toEqual(undefined);
    wrapper = bucketlistactions.reloadBucketlists();
    expect(wrapper).toEqual(undefined);
    wrapper = bucketlistactions.searchBucketlist("");
    expect(wrapper).toEqual(undefined);
});

it('dispatches item actions', ()=>{
    let wrapper = itemactions.createItem({none: null});
    expect(wrapper).toEqual(undefined);
    wrapper = itemactions.deleteItem("", 0);
    expect(wrapper).toEqual(undefined);
    wrapper = itemactions.editItem("", {none: null});
    expect(wrapper).toEqual(undefined);
    wrapper = itemactions.loadItems("");
    expect(wrapper).toEqual(undefined);
    wrapper = itemactions.reloadItems("", "");
    expect(wrapper).toEqual(undefined);
    wrapper = itemactions.searchItem("");
    expect(wrapper).toEqual(undefined);
});
