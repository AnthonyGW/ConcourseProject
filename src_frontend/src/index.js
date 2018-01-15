// src/index.js
//
// This is the starting point of the react app. The div element in the HTML page where react js is
// injected has been declared here.

// import react library to inherit component class and reactDOM to render the virtual DOM
import React from 'react';
import ReactDOM from 'react-dom';

// import components to make routes/paths to other components in the app
import { BrowserRouter as Router, Route } from 'react-router-dom';

// import bootstrap css
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

// import components that will be used by the route
import Home from './pages/home';
import UserBucketlists from './pages/bucketlists';
import BucketlistItems from './pages/bucketlist_items';

const app = document.getElementById('root');

class Point extends React.Component{
    render(){
    return(
    <Router>
        <div>
            <Route exact path="/" component={Home} />
            <Route path="/auth/logout" />
            <Route path="/auth/reset-password" />
            <Route exact path="/bucketlists/" component={UserBucketlists} />
            <Route path="/bucketlists/:bucketlistId/items/" component={BucketlistItems} />
        </div>
    </Router>);
    };
};
ReactDOM.render(<Point />, app || document.createElement('div'));
