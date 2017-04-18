import React from 'react';
import { Link } from 'react-router-dom';

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
            There {count === 1 ? 'is' : 'are'} <strong>{count} annotation{count === 1 ? '' : 's'}</strong> to sync to Fulcrum.
          </p>
        </div>
        <div className="row">
          <button onClick={this.handleRefreshCountClicked}>
            Refresh Count
          </button>
        </div>
        <div className="row">
          {syncButton}
        </div>
        <div className="row">
          <Link
            className="button"
            to="/sign-out">
            Sign Out of Fulcrum
          </Link>
        </div>
      </div>
    );
  }

  handleRefreshCountClicked() {
    this.checkAnnotations();
  }

  handleSyncButtonClicked() {
    this.props.history.push('/form-picker');
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
