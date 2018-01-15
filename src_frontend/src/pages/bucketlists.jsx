// src/pages/bucketlists.jsx
//
// This component renders the page to display the user's dashboard and their bucketlists.
// Also renders UI for the user's to manipulate bucketlists (create, edit and delete).

// import react library to inherit component class
import React from 'react';

// import bootstrap components to style overlays, forms, pagination buttons and navbar
import { Modal, Button, Image, Glyphicon } from 'react-bootstrap';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Grid, Row, Col, Panel } from 'react-bootstrap';
import { FormControl, ControlLabel, InputGroup } from 'react-bootstrap';
import { Pagination, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Table, tbody, tr } from 'react-bootstrap';

// import redirect component to change pages according to the routes defined in index.js
import { Redirect } from 'react-router-dom';

// import custom store component to access bucketlist values
import BucketlistStore from '../stores/BucketlistStore';

// import functions for performing actions on the bucketlist store
import * as bucketlistactions from '../actions/bucketlistactions';
import * as authactions from '../actions/authactions';

export default class UserBucketlists extends React.Component{
    constructor(){
        super();
        this.state = {
            user_bucketlists: [],
            name: "",
            date: "2017~0",
            month: 0,
            description: "",
            show_modal: false,
            editid: null,
            redirect: "",
            url: "",
            status: false,
            records_length: 0,
            active_page: 1,
            items: 0,
            limit: 10,
            createValid: false
        };
    }
    componentWillMount(){
        // on initializing the component, pass the query parameters on the url (if any)
        // into the get request sent to the API that data is retrieved from
        const parseQueryString = require('query-string');
        let queryParams = null;
        if(this.props.location.search){
            let queryString = this.props.location.search;
            queryParams = parseQueryString.parse(queryString);
        }
        BucketlistStore.retrieveBucketlists(queryParams);
        
        // Reload the values held in the state when the bucketlist store calls a method
        BucketlistStore.on('change', () => {
            this.setState({
                user_bucketlists: BucketlistStore.getAll(),
                records_length: BucketlistStore.records_length,
            });

            // Set information for the pagination component (number of pages)
            if(this.state.user_bucketlists.length === 0){
                this.setState({
                    status: true
                })
            } else {
                this.setState({
                    status: false
                })
            }
            if(this.state.records_length === null){
                window.location = "/";
            }
            if(this.state.records_length > 0){
                let items = Math.floor(this.state.records_length / this.state.limit);
                if(this.state.records_length > 10){
                    items = items + 1;
                } else {
                    items = 0;
                }
                this.setState({
                    items: items
                })
            }
        });
    }

    // store values in the state when they are put in the form
    handleChange(event){
        this.setState({
         [event.target.id]: event.target.value,
        });

        if(event.target.id === "name" && event.target.value === ""){
            this.setState({createValid: false});
        }
        else if(event.target.id === "name" && event.target.value !== ""){
            let validationState = this.validateDate(this.state.date);
            this.setState({createValid: validationState});
        }

        // handle input from the selection lists for the date
        let fixedyear = "2017~";
        if(this.state.date !== "2017~0"){
            fixedyear = this.state.date;
        }

        if(event.target.id === 'year'){
            fixedyear = event.target.value + '~' + this.state.month;
            let validationState = this.validateDate(fixedyear);
            if(validationState && this.state.name !== ""){
                validationState = true;
            } else {
                validationState = false;
            }
            this.setState({
                date: fixedyear,
                createValid: validationState
            });
        }

        if(event.target.id === 'month'){
            fixedyear = this.state.date;
            fixedyear = fixedyear.split('~');
            let validationState = this.validateDate(fixedyear[0]+'~'+event.target.value);
            if(validationState && (this.state.name !== "")){
                validationState = true;
            } else {
                validationState = false;
            }
            this.setState({
                month: event.target.value,
                date: fixedyear[0]+'~'+event.target.value,
                createValid: validationState
            });
        }
    }

    // check the input date and prevent making a bucketlist if it has passed
    validateDate(input_date){
        let today = new Date();
        let fixeddate = input_date.split('~');
        if(today.getFullYear() > parseInt(fixeddate[0])){
            return false;
        }
        else if(today.getFullYear() === parseInt(fixeddate[0]) && today.getMonth() >= parseInt(fixeddate[1])){
            return false;
        } else {
            return true;
        }
    }

    // submit the values in the form (which have been saved in the state)
    handleSubmit(e){
        e.preventDefault();
        const payload = {
            "name" : this.state.name,
            "date" : this.state.date,
            "description": this.state.description
        }
        if(this.state.editid){
            bucketlistactions.editBucketlist(this.state.editid, payload);
            this.close();
        }else{
            //throw in the token and call for a create-bucketlist action
            bucketlistactions.createBucketlist(payload);
            this.setState({
                active_page: 1
            })
        }        
    }

    handleDelete(id){
        bucketlistactions.deleteBucketlist(String(id), {page: this.state.active_page-1});
    }

    handleView(id, name){
        //route to the retrieved list view
        var url = '/bucketlists/'+id+'/items';
        localStorage.setItem('list_id', id);
        localStorage.setItem('list_name', name);
        this.setState({
            redirect: 'items',
            url: url
        })
    }

    handleEdit(id, name, date, description, cond){
        //open modal with the edit-bucketlist form
        this.setState({
            show_modal: cond,
            editid: id,
            name: name,
            description: description,
            date: date
        });
    }

    // close the modal when done
    close(){
        this.setState({
            show_modal: false,
            editid: null,
            name: "",
            date: "",
            description: ""
        });
        document.getElementById("create-list-form").reset();
    }

    handleLogout(){
        authactions.logout();
        this.setState({
            redirect: "logout",
            url: "/"
        })
    }

    handleSearch(event){
        bucketlistactions.searchBucketlist({'q': event.target.value});
        this.setState({
            active_page: 1
        })
    }

    selectPage(pageNumber) {
        this.setState({
            active_page: pageNumber
        });
        BucketlistStore.retrieveBucketlists(localStorage.getItem('token'), {'page':pageNumber-1});
    }

    computeDate(due){
        let today = new Date();
        let time_remaining = 0;
        let fixeddate = due.split('~');
        if(today.getFullYear() === parseInt(fixeddate[0]) && today.getMonth() >= parseInt(fixeddate[1])){
            return time_remaining;
        }
        let deadline = new Date(parseInt(fixeddate[0]), parseInt(fixeddate[1]), 1);
        deadline = new Date(deadline.getFullYear(), deadline.getMonth(), deadline.getDate());
        let one_day=1000*60*60*24;
        let today_ms = today.getTime();
        let deadline_ms = deadline.getTime();
        time_remaining = deadline_ms - today_ms;
        if(time_remaining < 0){
            time_remaining = 0;
        } else {
            time_remaining = Math.round(time_remaining / one_day);
        }
        return time_remaining;
    }

    render(){
        let bucketlists = this.state.user_bucketlists;
        const BucketlistTableData = bucketlists.map(bucketlist => {
            return(
                <tr key={bucketlist.id}>
                    <td><a href="#" onClick={()=>{this.handleView(bucketlist.id, bucketlist.name)}}>{bucketlist.name}</a></td>
                    <td>{bucketlist.description}</td>
                    <td>Days Remaining: {this.computeDate(bucketlist.date)}</td>
                    <td><a href="#"
                           onClick={()=>{this.handleEdit(bucketlist.id, bucketlist.name, bucketlist.date, bucketlist.description, true)}}>
                           Edit</a></td>
                    <td><a href="#" onClick={()=>{this.handleDelete(bucketlist.id)}}>Delete</a></td>
                </tr>
            );
        });
        let buttons_padding = { paddingTop: "5px" };
        let panelHeader = (
            <div>
                <Grid>
                    <Row>
                        <h1>My Bucketlists</h1>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <br />
                            <form>
                                <InputGroup>
                                    <InputGroup.Addon>
                                    <Glyphicon glyph="search"></Glyphicon>
                                    </InputGroup.Addon>
                                    <FormControl type="text" placeholder="" onChange={this.handleSearch.bind(this)} />
                                </InputGroup>
                            </form>
                        </Col>
                        <Col md={6}>
                            <Pagination
                                style={buttons_padding}
                                bsSize="small"
                                prev
                                next
                                first
                                last
                                ellipsis
                                boundaryLinks
                                items={this.state.items}
                                maxButtons={5}
                                activePage={this.state.active_page}
                                onSelect={this.selectPage.bind(this)} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
        const tooltip = (!this.state.createValid) ? 
            <Tooltip id="tooltip">You need to enter at least a name and a month that has not passed to make a bucketlist!</Tooltip>
         : <div></div>;
        let tooltip_trigger = (!this.state.createValid) ? {pointerEvents : 'none'} : {};         
        let redirect = this.state.redirect;
        if(redirect === 'logout'){
            return <Redirect to={this.state.url} />
        }
        else if(redirect === 'items'){
            return <Redirect to={this.state.url} />
        }
        else if(redirect === 'home'){
            return <Redirect to={this.state.url} />
        }
        else{
        return (
            <div>
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Image responsive width={70} height={90} alt="img" src={require("../assets/newlogo_lg.png")}
                                   onClick={()=>{this.setState({redirect: "home", url: "/"});}} circle />
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav pullRight>
                        <NavItem onClick={()=>{window.location = "/bucketlists/"}}>Bucketlists</NavItem>
                        {/* <NavItem onClick={()=>{this.setState({redirect: "settings", url: "/auth/reset-password"})}}>Settings</NavItem> */}
                        <NavItem onClick={()=>{this.handleLogout()}}>Log Out</NavItem>
                    </Nav>
                </Navbar>
                <Grid>
                    <Row>
                        <Col md={4}>
                            <Panel>
                                <form id="create-list-form" onSubmit={this.handleSubmit.bind(this)}>
                                    <FormControl type="text" onChange={this.handleChange.bind(this)}
                                                 id="name" placeholder="New Bucketlist" />
                                    <br />
                                    <ControlLabel>Done By:</ControlLabel><br />
                                    <FormControl componentClass="select" onChange={this.handleChange.bind(this)}
                                                 id="month" placeholder="Month">
                                        <option value="0">Month</option>
                                        <option value="0">January</option>
                                        <option value="1">February</option>
                                        <option value="2">March</option>
                                        <option value="3">April</option>
                                        <option value="4">May</option>
                                        <option value="5">June</option>
                                        <option value="6">July</option>
                                        <option value="7">August</option>
                                        <option value="8">September</option>
                                        <option value="9">October</option>
                                        <option value="10">November</option>
                                        <option value="11">December</option>
                                    </FormControl>
                                    <br />
                                    <FormControl componentClass="select" onChange={this.handleChange.bind(this)}
                                                 id="year" placeholder="Year">
                                        <option value="1">Year</option>
                                        <option value="2017">2017</option>
                                        <option value="2018">2018</option>
                                        <option value="2019">2019</option>
                                        <option value="2020">2020</option>
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                        <option value="2028">2028</option>
                                    </FormControl>
                                    <br />
                                    <ControlLabel>Quote:</ControlLabel><br />
                                    <FormControl componentClass="textArea" type="text" onChange={this.handleChange.bind(this)}
                                                 id="description" />
                                    <br />
                                    <OverlayTrigger placement="right" overlay={tooltip}>
                                    <div style={{display: 'inline-block', cursor: 'not-allowed'}}>
                                    <Button type="submit" style={tooltip_trigger} disabled={!this.state.createValid}>Submit New List</Button>
                                    </div>
                                    </OverlayTrigger>
                                </form>
                            </Panel>
                        </Col>
                        <Col md={8}>
                            <Panel header={panelHeader} bsSize="large">
                                {this.state.status ? (<h4>No bucketlists here!</h4>) : (
                                    <Table>
                                        <tbody>
                                            {BucketlistTableData}
                                        </tbody>
                                    </Table>
                                    )}
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
                <Modal show={this.state.show_modal} onHide={this.close.bind(this)}>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit {this.state.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormControl type="text" onChange={this.handleChange.bind(this)} id="name"
                                     placeholder={"List Name: "+this.state.name} />
                        <br />
                        <ControlLabel>Done By:</ControlLabel><br />
                        <FormControl componentClass="select" onChange={this.handleChange.bind(this)} id="month" placeholder="Month">
                            <option value="none">Month</option>
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </FormControl>
                        <br />
                        <FormControl componentClass="select" onChange={this.handleChange.bind(this)} id="year" placeholder="Year">
                            <option value="none">Year</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                        </FormControl>
                        <br />
                        <FormControl componentClass="textArea" type="text"
                                     onChange={this.handleChange.bind(this)}
                                     placeholder={"Quote: "+this.state.description}
                                     id="description" />
                        <br />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Submit</Button> | <Button onClick={this.close.bind(this)}>Close</Button>
                    </Modal.Footer>
                </form>
                </Modal>
            </div>
        );}
    }
}
