import React from 'react';

import Navigation from './Navigation';

require('./FormPicker.css');

export default class FormPicker extends React.Component {
  static propTypes = {
    forms: React.PropTypes.array.isRequired,
    onFormPicked: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.handleFormClicked = this.handleFormClicked.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);

    this.sortedForms = props.forms.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }

      if (b.name > a.name) {
        return -1;
      }

      return 0;
    });

    this.state = {
      filteredForms: this.sortedForms
    };
  }

  render() {
    return (
      <div>
        <div className="row">
          <p>Select a form to sync annotations.</p>
        </div>
        <div className="row">
          <div className="input-field col-4">
            <input
              onChange={this.handleSearchChange}
              type="text" />
            <label htmlFor="email">Search Forms</label>
          </div>
        </div>
        <div className="row">
          {this.state.filteredForms.map((form, i) => {
            return (
              <button key={i}
                onClick={() => this.handleFormClicked(form)}>
                {form.name}
              </button>
            );
          })}
        </div>
        <Navigation />
      </div>
    );
  }

  handleSearchChange(event) {
    const searchText = event.target.value.trim().toLowerCase();
    let filteredForms = null;

    if (searchText.length > 0) {
      filteredForms = this.sortedForms.filter((form) => {
        return form.name.toLowerCase().indexOf(searchText) > -1;
      });
    } else {
      filteredForms = this.sortedForms;
    }

    this.setState({ filteredForms });
  }

  handleFormClicked(form) {
    this.props.onFormPicked(form);
    this.props.history.push('/field-picker');
  }
}
