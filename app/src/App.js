import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: '',
      teamMembers: '',
      description: '',
      table: '',
      link: ''
    }

    this.floors = [
      {
        floorNumber: 1,
        firstTableCharCode: 65,
        lastTableCharCode: 80
      },
      {
        floorNumber: 2,
        firstTableCharCode: 65,
        lastTableCharCode: 81
      }
    ];

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);
  }

  generateTableNumberOptionFields() {
    const tables = [<option value="-" key="-">-</option>];

    for (let floor of this.floors) {
      for (let cc = floor.firstTableCharCode; cc <= floor.lastTableCharCode; cc++) {
        const table = `${floor.floorNumber}${String.fromCharCode(cc)}`;
        tables.push(<option value={table} key={table}>{table}</option>);
      }
    }
    return tables;
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
        <div className="App">
          {this.state && this.state.user ? <div>
            <form onSubmit={this.handleSubmit}>
              <div>
                <label htmlFor="projectName">Project name *</label>
                <input id="projectName" name="projectName" type="text" value={this.state.projectName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="teamMembers">Team members *</label>
                <textarea id="teamMembers" name="teamMembers" value={this.state.teamMembers} onChange={this.handleChange}></textarea>
              </div>
              <div>
                <label htmlFor="description">Description *</label>
                <textarea id="description" name="description" value={this.state.description} onChange={this.handleChange}></textarea>
              </div>
              <div>
                <label htmlFor="table">Table *</label>
                <select id="table" name="table" value={this.state.table} onChange={this.handleChange}>
                  {this.generateTableNumberOptionFields()}
                </select>
              </div>
              <div>
                <label htmlFor="link">Link to project repo or some other relevant resource (optional)</label>
                <input id="link" name="link" type="url" value={this.state.link} onChange={this.handleChange} />
              </div>
              <div>
                <button>Submit</button>
              </div>
            </form>
          </div> : <div>
            {this.state && this.state.view !== "register" ?
              <LoginForm register={register} update={this.update}/> :
              <RegisterForm login={login} update={this.update}/>
            }
          </div>}
          <header className="App-header">
          </header>
        </div>
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
          <div>
            <label for="register_team_name">Team name:</label>
            <input id="register_team_name" name="team_name" type="text" onChange={this.changeTeamName}/>
          </div>
          <div>
            <label for="register_team_name">Password:</label>
            <input id="register_password1" name="password1" type="text" onChange={this.changePw}/>
          </div>
          <div>
            <label for="register_team_name">Repeat password:</label>
            <input id="register_password2" name="password2" type="text" onChange={this.changePw2}/>
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
          <div>
            <label for="login_team_name">Team name:</label>
            <input id="login_team_name" name="team_name" type="text" onChange={this.changeTeamName}></input>
          </div>
          <div>
            <label for="login_password">Password:</label>
            <input id="login_password" name="password" type="text" onChange={this.changePw}></input>
          </div>
          <div>
            <input id="login_submit" name="submit" type="submit" value="Login"/>
          </div>
        </form>
        <button onClick={this.props.register}> Register instead </button>
      </div>
    )
  }
}

export default App;
