import React from 'react';

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
        {this.props.forms.map((form, i) => {
          return (
            <button key={i}
              onClick={this.handleFormClicked}>
              form.name
            </button>
          );
        })}
      </div>
    );
  }

  handleFormClicked() {
    this.props.onFormPicked('blah');
  }
}
