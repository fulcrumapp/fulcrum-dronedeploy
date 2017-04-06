import React from 'react';
import { Form } from 'fulcrum-core';

import Navigation from './Navigation';

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
    const writableFields = this.props.selectedForm.flattenElements(false).filter((field) => field.isTextElement && !field.isNumeric);

    if (writableFields.length === 0) {
      return (
        <div>
          <div className="row">
            <p>There are no text fields to write to in this app.</p>
          </div>
          <Navigation />
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          <p>Select a field to save annotation descriptions. Descriptions can only be saved to text fields.</p>
        </div>
        <div className="row">
          {writableFields.map((field, i) => {
            return (
              <button key={i}
                onClick={() => this.handleFieldClicked(field)}>
                {field.label}
              </button>
            );
          })}
        </div>
        <Navigation />
      </div>
    );
  }

  handleFieldClicked(field) {
    this.props.onFieldPicked(field);
    this.props.history.push('/annotations-syncer');
  }
}
