import React from 'react';
import { Redirect } from 'react-router-dom';

require('./Expanded.css');

export default class Annotations extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.handleRefreshCountClicked = this.handleRefreshCountClicked.bind(this);
    this.handleSyncButtonClicked = this.handleSyncButtonClicked.bind(this);

    this.state = {
      annotations: [],
      syncClicked: false
    };
  }

  render() {
    if (this.state.syncClicked) {
      const redirectTo = '/form-picker';
      return (
        <Redirect to={redirectTo} />
      );
    }

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
      </div>
    );
  }

  handleRefreshCountClicked() {
    this.checkAnnotations();
  }

  handleSyncButtonClicked() {
    this.setState({ syncClicked: true });
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
