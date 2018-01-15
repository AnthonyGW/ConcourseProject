import React from 'react';
import 'jest-enzyme';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import { expect as chaiexpect } from 'chai';
import moxios from 'moxios';
import sinon from 'sinon';

import Adapter from 'enzyme-adapter-react-16';

import { NavItem, ControlLabel, Button } from 'react-bootstrap';
import UserBucketlists from '../pages/bucketlists';
import BucketlistItems from '../pages/bucketlist_items';

Enzyme.configure({ adapter: new Adapter() });

function setUpLists(){
    const props = {
        location: {search: ""}
    }
    return shallow(<UserBucketlists {...props} />)
}

function setUpItems(){
    const props = {
        location: {search: ""}
    }
    return shallow(<BucketlistItems {...props} />)
}

describe('<BucketlistItems />', ()=>{
        const wrapper = setUpItems();

        it('renders the table for bucketlist items.', ()=>{
                chaiexpect(wrapper.find('Table')).to.have.length(1);
        });
});


it('renders create item button', ()=>{
    const wrapper = setUpItems();    
    const button = <Button type="submit">Submit New Activity</Button>;
    expect(wrapper).toContainReact(button);
});

it('returns items', ()=>{
    const wrapper = setUpLists();
    const button = <Button type="submit">Submit</Button>;
    expect(wrapper).toContainReact(button);
});

describe('mocking bucketlist requests', ()=>{
    beforeEach(()=>{
        moxios.install()
    })
  
    afterEach(()=>{
        moxios.uninstall()
    })

    it('loads bucketlists from store', ()=>{
        const wrapper = setUpLists();
        moxios.wait(()=>{
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    {'bucketlists': {'user':'1', 'id':'0', 'name':'list1', 'date':'10101000', 'description':'lol'},
                     'records_length': 1
                    },
                ]
            }).then(()=>{
                chaiexpect(wrapper.state().user_bucketlists).to.equal([{'user':'1', 'id':'0', 'name':'list1', 'date':'10101000', 'description':'lol'}]);
                chaiexpect(wrapper.state().records_length).to.equal(1);
                chaiexpect(wrapper.state().show_modal).to.equal(false);
                wrapper.handleEdit(0, "list1", "10101000", "lol", true);
                chaiexpect(wrapper.state().show_modal).to.equal(true);
                done();
            })
        })
    });

    it('calls componentWillMount', ()=>{
        sinon.spy(UserBucketlists.prototype, 'componentWillMount');
        const wrapper = setUpLists();
        moxios.wait(()=>{
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    {'bucketlists': {'user':'1', 'id':'0', 'name':'list1', 'date':'10101000', 'description':'lol'},
                     'records_length': 1
                    },
                ]
            }).then(()=>{
                chaiexpect(UserBucketlists.prototype.componentWillMount.calledOnce).to.equal(true);
                done();
            })
        })
    });

    it('renders components in bucketlist page', ()=>{
        const wrapper = setUpLists();
        moxios.wait(()=>{
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    {'bucketlists': {'user':'1', 'id':'0', 'name':'list1', 'date':'10101000', 'description':'lol'},
                     'records_length': 1
                    },
                ]
            }).then(()=>{
                // it renders a table for the bucket lists
                chaiexpect(wrapper.find('Table')).to.have.length(1);

                // it renders panels
                chaiexpect(wrapper.find('Panel')).to.have.length(2);

                // it renders form labels
                const formlabel = <ControlLabel>Done By:</ControlLabel>;
                expect(wrapper).toContainReact(formlabel);

                // it renders form buttons
                const button = <Button type="submit">Submit New Activity</Button>;
                expect(wrapper).toContainReact(button);
                done();
            })
        })
    })
});

describe('mocking bucketlist item requests', ()=>{
    beforeEach(()=>{
        moxios.install()
    })
  
    afterEach(()=>{
        moxios.uninstall()
    })

    it('loads items from store', ()=>{
        const wrapper = setUpItems();
        moxios.wait(()=>{
            let request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: [
                    {'items': {'id':'0', 'bucketlist_id':'0', 'name':'item1', 'description':'lol'},
                     'records_length': 1
                    },
                ]
            }).then(()=>{
                chaiexpect(wrapper.state().bucketlist_items).to.equal([{'id':'0', 'bucketlist_id':'0', 'name':'item1', 'description':'lol'}]);
                chaiexpect(wrapper.state().records_length).to.equal(1);
                done();
            })
        })
    });
});
