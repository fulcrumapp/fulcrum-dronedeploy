import React from 'react';
import series from 'async/series';

import { Record, Form, TextElement } from 'fulcrum-core';

require('./AnnotationsSyncer.css');

export default class AnnotationsSyncer extends React.Component {
  static propTypes = {
    annotations: React.PropTypes.array.required,
    selectedForm: React.PropTypes.instanceOf(Form).required,
    selectedField: React.PropTypes.instanceOf(TextElement).required,
    fulcrumAPI: React.PropTypes.object.required,
    onAnnotationsSyncd: React.PropTypes.func.required
  }

  constructor(props) {
    super(props);

    this.onAnnotationsSyncd = this.onAnnotationsSyncd.bind(this);

    this.syncAnnotations();
  }

  render() {
    return (
      <div className="row syncing">
        <p>
          Syncing Annotations ...
        </p>
      </div>
    );
  }

  syncAnnotation(annotation, callback) {
    const attributes = {
      latitude: annotation.geometry.lat,
      longitude: annotation.geometry.lng,
      form_values: {}
    };

    attributes.form_values[this.props.selectedField.key] = annotation.description;

    const record = new Record(attributes, this.props.selectedForm);

    const recordObject = {record: record.toJSON()};

    this.props.fulcrumAPI.records.create(recordObject, callback);
  }

  syncAnnotations() {
    const tasks = this.props.annotations.map((annotation) => {
      return (callback) => {
        this.syncAnnotation(annotation, callback);
      };
    });

    series(tasks, this.onAnnotationsSyncd);
  }

  onAnnotationsSyncd(error, results) {
    this.props.onAnnotationsSyncd(error, results);

    if (!error) {
      this.props.history.push('/expanded');
    }
  }
}
