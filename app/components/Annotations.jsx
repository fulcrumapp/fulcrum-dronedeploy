import React from 'react';

import Navigation from './Navigation';

require('./Expanded.css');

export default class Annotations extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired,
    onAnnotationsUpdated: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.handleRefreshCountClicked = this.handleRefreshCountClicked.bind(this);
    this.handleSyncButtonClicked = this.handleSyncButtonClicked.bind(this);

    this.state = {
      annotations: []
    };

    this.checkAnnotations();
  }

  render() {
    const refreshCount = (
      <button onClick={this.handleRefreshCountClicked}>
        Refresh Count
      </button>
    );

    const count = this.state.annotations.length;

    let syncButton = null;

    if (count > 0) {
      syncButton = (
        <button onClick={this.handleSyncButtonClicked}>
          Sync Annotations
        </button>
      );
    }

    return (
      <div>
        <div className="row">
          <p>
            There {count === 1 ? 'is' : 'are'} <strong>{count} annotation{count === 1 ? '' : 's'}</strong> available to push to Fulcrum.
          </p>
        </div>
        <div className="row">
          {refreshCount}
        </div>
        <div className="row">
          {syncButton}
        </div>
        <Navigation />
      </div>
    );
  }

  handleRefreshCountClicked() {
    this.checkAnnotations();
  }

  handleSyncButtonClicked() {
    this.props.history.push('/form-picker')
  }

  checkAnnotations() {
    if (!this.props.droneDeployApi) {
      return;
    }

    this.props.droneDeployApi.Plans.getCurrentlyViewed()
      .then((plan) => {
        return this.props.droneDeployApi.Annotations.get(plan.id, { comments: true });
      })
      .then((annotations) => {
        const filteredAnnotations = annotations.filter((annotation) => {
          return annotation.type === 'marker';
        });

        this.props.onAnnotationsUpdated(filteredAnnotations);

        this.setState({ annotations: filteredAnnotations });
      });
  }
}
