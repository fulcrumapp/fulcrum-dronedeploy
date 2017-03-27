import React from 'react';

require('./Expanded.css');

export default class Annotations extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired,
    forms: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.handleRefreshCountClicked = this.handleRefreshCountClicked.bind(this);
    this.handleSyncButtonClicked = this.handleSyncButtonClicked.bind(this);

    this.state = {
      annotations: []
    };
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
      <p>
        There {count === 1 ? 'is' : 'are'} <strong>{count} annotation{count === 1 ? '' : 's'}</strong> available to push to Fulcrum.
        {refreshCount}
        {syncButton}
      </p>
    );
  }

  handleRefreshCountClicked() {
    this.checkAnnotations();
  }

  handleSyncButtonClicked() {
    console.log('sync');
    console.log(this.props.forms);
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

        if (filteredAnnotations && filteredAnnotations.length > 0) {
          this.setState({ annotations: filteredAnnotations });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }
}
