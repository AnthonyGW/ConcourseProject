// src/pages/home.jsx
//
// This component renders the page to display the landing page where users can create new accounts
// and log in to existing accounts.

// import react library to inherit component class
import React, { Component } from 'react';

// import axios method to dispatch HTTP requests
import axios from 'axios';

// import bootstrap components to style the page
import { Button, Grid, Row, Col, Carousel, Panel } from 'react-bootstrap';
import { HelpBlock, FormControl, ControlLabel, Glyphicon } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import * as authactions from '../actions/authactions';

export default class Home extends Component{
    
    // variables for inline CSS styling
    styling = {
        paddingLeft: "100px",
        paddingTop: "5px"
    }
    container = {
        paddingTop: "70px",
        paddingBottom: "10px"
    }
    
    constructor(){
        super();
        this.state = {
            home: false,
            register: true,
            login: true,
            name: "",
            email: "",
            password: "",
            createValid: false,
            nameValid: false,
            nameHelpblock: null,
            emailValid: false,
            emailHelpblock: null,
            passwordValid: false,
            passwordHelpblock: null
        }
    }

    // manage visibility of panels for registration and login
    toggleVisibility(section){
        if(section === 'home'){
            this.setState({
                home: false,
                register: true,
                login: true,
                name: "",
                email: "",
                password: ""
            })
            document.getElementById("register-form").reset();
            document.getElementById("login-form").reset();
        }
        else if(section === 'register'){
            this.setState({
                home: true,
                register: false,
                login: true,
                name: "",
                email: "",
                password: ""
            })
            document.getElementById("register-form").reset();
            document.getElementById("login-form").reset();
        }
        else if(section === 'login'){
            this.setState({
                home: true,
                register: true,
                login: false,
                name: "",
                email: "",
                password: ""
            })
            document.getElementById("register-form").reset();
            document.getElementById("login-form").reset();        }
    }

    // store the form values in state
    handleChange(event){
        if(event.target.id === 'name'){
            let nameValidation = this.validateInput('name', event.target.value);
            this.setState({nameValid: nameValidation});
        }
        else if (event.target.id === 'email'){
            let emailValidation = this.validateInput('email', event.target.value);
            this.setState({emailValid: emailValidation});
        }else{
            let passwordValidation = this.validateInput('password', event.target.value);
            this.setState({passwordValid: passwordValidation});
        }
        this.setState({
         [event.target.id]: event.target.value,
        })
    }

    // validate the input entered
    validateInput(type, value){
        switch(type){
            case "name": {
                let nameLength = (""+value).length
                if(nameLength > 3){
                    this.setState({nameHelpblock: null});
                    if(this.state.emailValid && this.state.passwordValid){
                        this.setState({createValid: true});
                    }
                    return true;
                }else{
                    this.setState({
                        createValid: false,
                        nameHelpblock: "Name must be more than 3 characters long"
                    });
                    return false;
                }
            }

            case "email": {
                let emailLength = (""+value).length
                if(emailLength > 9){
                    this.setState({emailHelpblock: null})
                    if(this.state.nameValid && this.state.passwordValid){
                        this.setState({createValid: true});
                    }
                    return true;
                }else{
                    this.setState({
                        createValid: false,
                        emailHelpblock: "Email address must have more than 9 characters"
                    });
                    return false;
                }
            }

            case "password": {
                let passwordLength = (""+value).length
                if(passwordLength > 4){
                    this.setState({passwordHelpblock: null});
                    if(this.state.nameValid && this.state.emailValid){
                        this.setState({createValid: true});
                    }
                    return true;
                }else{
                    this.setState({
                        createValid: false,
                        passwordHelpblock: "Password must be more than 4 characters long"
                    });
                    return false;
                }
            }

            default: {
                break;
            }
        }
    }

    // submit form values (saved in state) to api
    submitRegister(e){
        e.preventDefault();
        const payload = {
            'name': this.state.name,
            'email': this.state.email,
            'password': this.state.password
        }
        axios({
            method: 'post',
            url: 'http://bucketlistultimaapi.herokuapp.com/auth/register',
            data: payload
        }).then((response) => {
            console.log(response.data['message']);
            this.toggleVisibility('login');
        }).catch((error) => {
            console.log(error);
        });
    }

    // submit form values (saved in state) to api
    submitLogin(e){
        e.preventDefault();
        const payload = {
            "email" : this.state.email,
            "password" : this.state.password
        }
        axios({
            method: 'post',
            url: 'http://bucketlistultimaapi.herokuapp.com/auth/login',
            data: payload,
            withCredentials: false
        }).then((response) => {
                    console.log("Log in message", response.data['message']);
                    console.log("Log in token", response.data['access_token']);
                    authactions.setAuthToken(response.data['access_token']);
                    authactions.resetAuthToken();
                    window.location='/bucketlists/';
        }).catch((error) => {
        console.log(error);
        });
    }

    render(){
      return (
        <Grid>
            <Row style={this.container}>
                <Col md={1} mdOffset={4}><Button bsSize="large" onClick={()=>{this.toggleVisibility('register');}}>Register</Button></Col>
                <Col md={2} style={this.styling}>
                    <Button onClick={()=>{this.toggleVisibility('home');}}><Glyphicon glyph="home"></Glyphicon></Button>
                </Col>
                <Col md={1}><Button bsSize="large" onClick={()=>{this.toggleVisibility('login');}}>Log In</Button></Col>
            </Row>
            <Row hidden={this.state.home}>
                <Carousel>
                    <Carousel.Item>
                        <img width={1280} height={550} alt="img" src={require("../assets/sample.png")} />
                        <Carousel.Caption>
                            <h2>BUCKET LIST ULTIMA</h2>
                            <h2>"BLU"</h2>
                            <h3>The Ultimate Bucket List Maker!</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1280} height={550} alt="img" src={require("../assets/sample.png")} />
                        <Carousel.Caption>
                            <h3>What Do You Want To Do?</h3>
                            <h4>Track Your Life Goals</h4>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1280} height={550} alt="img" src={require("../assets/sample.png")} />
                        <Carousel.Caption>
                            <h3>What Do You Want To Do?</h3>
                            <h4>Share your Achievements with Friends</h4>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img width={1280} height={550} alt="img" src={require("../assets/sample.png")} />
                        <Carousel.Caption>
                            <h3>What Do You Want To Do?</h3>
                            <h4>Follow Your Friends' Achievements</h4>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </Row>
            <Row hidden={this.state.register} bsStyle="primary">
                <Col md={6} mdOffset={3}>
                    <Panel>
                        <h2>Create New Account</h2>
                        <form id="register-form" onSubmit={this.submitRegister.bind(this)}>
                            <ControlLabel><h4>Enter your username:</h4></ControlLabel><br />
                            <FormControl type="text" onChange={this.handleChange.bind(this)} id="name" placeholder="Username" />
                            <HelpBlock>{this.state.nameHelpblock}</HelpBlock>
                            <br />
                            <ControlLabel><h4>Enter your email:</h4></ControlLabel><br />
                            <FormControl type="text"  onChange={this.handleChange.bind(this)} id="email" placeholder="Email" />
                            <HelpBlock>{this.state.emailHelpblock}</HelpBlock>
                            <br />
                            <label><h4>Enter your password:</h4></label><br />
                            <FormControl type="password" onChange={this.handleChange.bind(this)} id="password" placeholder="Password" />
                            <HelpBlock>{this.state.passwordHelpblock}</HelpBlock>
                            <br />
                            <Button type="submit" disabled={!this.state.createValid}>Submit</Button>
                        </form>
                    </Panel>
                </Col>
            </Row>
            <Row hidden={this.state.login} bsStyle="primary">
                <Col md={6} mdOffset={3}>
                <Panel>
                <h2>Log in to your account</h2>
                <form id="login-form" onSubmit={this.submitLogin.bind(this)}>
                    <ControlLabel>Enter your email:</ControlLabel><br />
                    <FormControl type="text" onChange={this.handleChange.bind(this)} id="email" placeholder="Email" />
                    <br />
                    <label>Enter your password:</label><br />
                    <FormControl type="password" onChange={this.handleChange.bind(this)} id="password" placeholder="Password" />
                    <br />
                    <Button type="submit">Submit</Button>
                </form>
                <br />
                <p>Already logged in? Go to your <Link to="/bucketlists/">Bucketlists</Link></p>
            </Panel>
                </Col>
            </Row>
        </Grid>
        );
    }
}
