import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  componentWillMount(){
    this.update();
  }
  update(){
    fetch('/api/')
    .then(data => data.json())
    .then(data => {
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
    return (
      <div className="App">
        {this.state && this.state.user ? <div>
        </div> : <div>
          {this.state && this.state.view !== "register" ?
            <LoginForm register={register} update={this.update}/> :
            <RegisterForm login={login} update={this.update}/>
          }
        </div>}
        <header className="App-header">
        </header>
      </div>
    );
  }
}
class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.changeTeamName = this.changeTeamName.bind(this);
    this.changePw = this.changePw.bind(this);
    this.changePw2 = this.changePw2.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeTeamName(e){
    this.setState({'team_name':e.target.value});
  }
  changePw(e){
    this.setState({'password':e.target.value});
  }
  changePw2(e){
    this.setState({'password2':e.target.value});
  }
  submit(e){
    e.preventDefault();
    var form = document.getElementById('register_form');
    var formdata = new FormData(form);
    fetch('/register', {method:"POST", body: formdata})
    .then(this.props.update);
  }
  render(){
    return (
      <div>
        <form id="register_form" onSubmit={this.submit}>
          <label for="register_team_name">Team name:</label>
          <input id="register_team_name" name="team_name" type="text" onChange={this.changeTeamName}/>
          <label for="register_team_name">Password:</label>
          <input id="register_password1" name="password1" type="text" onChange={this.changePw}/>
          <label for="register_team_name">Repeat password:</label>
          <input id="register_password2" name="password2" type="text" onChange={this.changePw2}/>
          <input id="register_submit" name="register_submit" type="submit" value="Register"/>
        </form>
        <button onClick={this.props.login}> Login instead </button>
      </div>
    )
  }
}
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.changeTeamName = this.changeTeamName.bind(this);
    this.changePw = this.changePw.bind(this);
    this.submit = this.submit.bind(this);
  }

  changeTeamName(e){
    this.setState({'team_name':e.target.value});
  }
  changePw(e){
    this.setState({'password':e.target.value});
  }
  submit(e){
    e.preventDefault();
    var form = document.getElementById('login_form');
    var formdata = new FormData(form);
    fetch('/login', {method:"POST", body: formdata})
    .then(this.props.update);
  }
  render(){
    return (
      <div>
        <form id="login_form" onSubmit={this.submit}>
          <label for="login_team_name">Team name:</label>
          <input id="login_team_name" name="team_name" type="text" onChange={this.changeTeamName}></input>
          <label for="login_password">Password:</label>
          <input id="login_password" name="password" type="text" onChange={this.changePw}></input>
          <input id="login_submit" name="submit" type="submit" value="Login"/>
        </form>
        <button onClick={this.props.register}> Register instead </button>
      </div>
    )
  }
}

export default App;
