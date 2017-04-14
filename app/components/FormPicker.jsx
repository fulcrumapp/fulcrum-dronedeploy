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
  }

  render() {
    return (
      <div>
        <div className="row">
          <p>Select a form to sync annotations.</p>
        </div>
        <div className="row">
          {this.props.forms
            .sort((a, b) => {
              if (a.name > b.name) {
                return 1;
              }

              if (b.name > a.name) {
                return -1;
              }

              return 0;
            })
            .map((form, i) => {
              return (
                <button key={i}
                  onClick={() => this.handleFormClicked(form)}>
                  {form.name}
                </button>
              );
            })
          }
        </div>
        <Navigation />
      </div>
    );
  }

  handleFormClicked(form) {
    this.props.onFormPicked(form);
    this.props.history.push('/field-picker');
  }
}
