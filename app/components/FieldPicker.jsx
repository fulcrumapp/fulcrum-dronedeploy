import React from 'react';
import { Form } from 'fulcrum-core';

export default class FieldPicker extends React.Component {
  static propTypes = {
    selectedForm: React.PropTypes.instanceOf(Form),
    onFieldPicked: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.handleFieldClicked = this.handleFieldClicked.bind(this);
  }

  render() {
    return (
      <div>
        <div className="row">
          <p>Select a field for annotation comments.</p>
        </div>
        <div className="row">
          {this.props.selectedForm.elements.map((field, i) => {
            return (
              <button key={i}
                onClick={() => this.handleFieldClicked(field)}>
                {field.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  handleFieldClicked(field) {
    this.props.onFieldPicked(field);
  }
}
