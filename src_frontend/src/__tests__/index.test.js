import Point from '../index.js';

it('renders without crashing', ()=>{
    expect(JSON.stringify(Point)).toMatchSnapshot();
});