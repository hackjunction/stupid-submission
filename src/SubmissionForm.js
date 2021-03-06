import React from 'react';

const floors = [
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

function generateTableNumberOptionFields() {
	const tables = [];

	for (let floor of floors) {
		for (let cc = floor.firstTableCharCode; cc <= floor.lastTableCharCode; cc++) {
			const table = `${floor.floorNumber}${String.fromCharCode(cc)}`;
			tables.push(<option value={table} key={table}>{table}</option>);
		}
	}
	return tables;
}

export default function SubmissionForm(props) {
  console.log(props)
	return (
		<div className="form-container">
      <p>Be careful, your location and team name set in the system on the first time you submit will be the ones we will use for finding you for judging. All of the other information you can edit by submitting the form again.</p>
    <form onSubmit={props.handleSubmit}>
      <div>
        <label htmlFor="projectName">Project name *</label>
        <input id="projectName" name="projectName" type="text" value={props.projectName} onChange={props.handleChange} />
      </div>
      <div>
        <label htmlFor="teamMembers">Team members (ONE ON EACH LINE!) *</label>
        <textarea id="teamMembers" name="teamMembers" value={props.teamMembers} onChange={props.handleChange}></textarea>
      </div>
      <div>
        <label htmlFor="description">Description *</label>
        <textarea id="description" name="description" value={props.description} onChange={props.handleChange}></textarea>
      </div>
      <div>
        <label htmlFor="table">Table *</label>
        <select id="table" name="table" value={props.table} onChange={props.handleChange}>
					<option value="">Select a table</option>
					{generateTableNumberOptionFields()}
        </select>
      </div>
      <div>
        <label htmlFor="link">Link to project repo or some other relevant resource (optional)</label>
        <input id="link" name="link" type="url" value={props.link} onChange={props.handleChange} />
      </div>
      <div>
        <button disabled={!props.isValid || props.submitButtonText === 'Submitting...'}>{props.submitButtonText}</button>
      </div>
    </form>
  </div>
	);
}
