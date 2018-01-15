import React from 'react';
import 'jest-enzyme';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

import Home from '../pages/home';

Enzyme.configure({ adapter: new Adapter() });

it('renders carousel', ()=>{
    const wrapper = shallow(<Home />);
    const title = <h2>BUCKET LIST ULTIMA</h2>;
    expect(wrapper).toContainReact(title);
});

it('renders register form', ()=>{
    const wrapper = shallow(<Home />);
    const formtitle = <h4>Enter your username:</h4>;
    expect(wrapper).toContainReact(formtitle);
});
