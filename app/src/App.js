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
    return (
      <div className="App">
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
      </div>
    );
  }
}

export default App;
