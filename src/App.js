import React, { Component } from 'react';
import SubmissionForm from './SubmissionForm';
import './index.css';

class App extends Component {
  constructor(props){
    super(props);
    this.update = this.update.bind(this);
  }
  update(){
    fetch('/api/', {
      credentials: 'same-origin'
    })
    .then(data => data.json())
    .then(data => {
      console.log(data)
      this.setState(data);
    })
    .catch((err) => {
      console.log("something went wrong");
    })
  }

  render() {
    function login(){
      console.log("login")
      this.setState({view: "login"});
    }
    login = login.bind(this);
    function register(){
      console.log("register")
      this.setState({view: "register"});
    }
    register = register.bind(this);
    console.log(this.state)
    return (
      <div className="App">
        { this.state && this.state.pastDeadline === true ? <div>
          {this.state.judgingLink ? <div className="judging-div">
            <p>
              Go judge the other project from this link:
            </p>
            <a href={this.state.judgingLink}>
              <p className="judging-link">Go to the Judging site!</p>
            </a>
          </div>:<div>
            <p>
              Unfortunately you missed the submission deadline :(
              Go check out all the cool projects anyway!
            </p>
          </div>}
        </div> :
        <div className="App">
          {this.state && this.state.user ? <div>
            {this.state.submission ?
              <SubmissionFormContainer projectName={this.state.submission.projectName} table={this.state.submission.table} description={this.state.submission.description} teamMembers={this.state.submission.teamMembers && this.state.submission.teamMembers.join('\n')} link={this.state.submission.link}/>
            : <SubmissionFormContainer/>
            }
          </div> : <div>
            {this.state && this.state.view !== "register" ?
              <LoginForm register={register} update={this.update}/> :
              <RegisterForm login={login} update={this.update}/>
            }
          </div>}
          <header className="App-header">
          </header>
        </div>}
      </div>
    );
  }
}

class SubmissionFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: props.projectName || '',
      teamMembers: props.teamMembers || '',
      description: props.description || '',
      table: props.table || '',
      link: props.link || '',
      isValid: false,
      submitButtonText: 'Submit'
    }

    this.isValid = this.isValid.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  isValid() {
    this.setState({
      isValid: this.state.projectName !== ''
        && this.state.teamMembers !== ''
        && this.state.description !== ''
        && this.state.table !== ''
    });
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    }, this.isValid);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ submitButtonText: 'Submitting...' });

    const data = {
      projectName: this.state.projectName,
      teamMembers: this.state.teamMembers.split(/\n/),
      description: this.state.description,
      table: this.state.table,
      link: this.state.link
    };

    fetch('/submit', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(() => this.setState({ submitButtonText: 'Submission succeeded!' }))
    .catch(() => this.setState({ submitButtonText: 'Submission failed.' }));
  }

  render() {
    return (
      <SubmissionForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        {...this.state}
      />
    );
  }
}

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    console.log(event.target)
    if(event.target.name === "password"){
      this.setState({ "password2": event.target.value });
    }
    if(event.target.name === "password2"){
      this.setState({ "password": event.target.value });
    }
  }

  submit(e){
    e.preventDefault();
    var form = document.getElementById('register_form');
    var formdata = new FormData(form);
    var fields = {};
    formdata.forEach(function(value, key){
        fields[key] = value;
    });
    console.log(fields)
    fetch('/register', {
      method:"POST",
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(fields)})
    .then(this.props.update);
  }
  render(){
    return (
      <div className="form-container">
        <form id="register_form" onSubmit={this.submit}>
          <div>
            <label for="register_team_name">Team name:</label>
            <input id="register_team_name" name="teamName" type="text" onChange={this.handleChange} value={this.state ? this.state.team_name : ""}/>
          </div>
          <div>
            <label for="register_password1">Password:</label>
            <input id="register_password1" name="password" type="text" onChange={this.handleChange} value={this.state ? this.state.password1 : ""}/>
          </div>
          <div>
            <label for="register_password2">Repeat password:</label>
            <input id="register_password2" name="password2" type="text" onChange={this.handleChange} value={this.state ? this.state.password2 : ""}/>
          </div>
          <div>
            <input id="register_submit" name="register_submit" type="submit" value="Register"/>
          </div>
        </form>
        <button onClick={this.props.login}> Login instead </button>
      </div>
    )
  }
}
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  submit(e){
    e.preventDefault();
    var form = document.getElementById('login_form');
    var formdata = new FormData(form);
    var fields = {};
    formdata.forEach(function(value, key){
        fields[key] = value;
    });
    console.log(fields)
    fetch('/login', {
      method:"POST",
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, body: JSON.stringify(fields)})
    .then(this.props.update);
  }
  render() {
    return (
      <div className="form-container">
        <form id="login_form" onSubmit={this.submit}>
          <div>
            <label htmlFor="login_team_name">Team name:</label>
            <input id="login_team_name" name="teamName" type="text" onChange={this.handleChange}></input>
          </div>
          <div>
            <label htmlFor="login_password">Password:</label>
            <input id="login_password" name="password" type="text" onChange={this.handleChange}></input>
          </div>
          <div>
            <input id="login_submit" name="submit" type="submit" value="Login"/>
          </div>
        </form>
        <button onClick={this.props.register}> Register instead </button>
      </div>
    );
  }
}

export default App;
