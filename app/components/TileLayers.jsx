import React from 'react';
import { withRouter } from 'react-router';

class TileLayers extends React.Component {
  static propTypes = {
    match: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    history: React.PropTypes.object.isRequired,
    droneDeployApi: React.PropTypes.object.isRequired,
    fulcrumAPI: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.handleLayerNameChange = this.handleLayerNameChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    this.state = {
      layer: null,
      layerName: null,
      tileLayerUrl: null
    };

    this.checkDroneDeployTileLayers();
  }

  render() {
    if (this.state.tileLayerUrl) {
      if (this.state.layer) {
        const layerHref = `https://web.fulcrumapp.com/layers/${this.state.layer.id}`;

        return (
          <div className="row">
            <p>Tile layer saved in Fulcrum: <a href={layerHref}>{this.state.layer.name}</a></p>
          </div>
        );
      }

      return (
        <div>
          <div className="row">
            <p>
              Type a layer name below and click <strong>Add Layer</strong> below to add this drone imagery to Fulcrum.
            </p>
            <p>
              <strong>NOTE:</strong> Currently, layers added to Fulcrum expire after 30 days.
            </p>
          </div>
          <form onSubmit={this.handleFormSubmit}>
            <div className="row">
              <div className="input-field col-4">
                <input
                  onChange={this.handleLayerNameChange}
                  type="text" />
                <label htmlFor="layer-name">Layer Name</label>
              </div>
            </div>
            <div className="row">
              <button type="submit">Add Layer to Fulcrum</button>
            </div>
          </form>
        </div>
      );
    }

    return (
      <div className="row">
        <p>There are no tile layers to add to Fulcrum.</p>
      </div>
    );
  }

  handleLayerNameChange(event) {
    this.setState({ layerName: event.target.value.trim() });
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const layerObj = {
      layer: {
        name: this.state.layerName,
        source: this.state.tileLayerUrl,
        type: 'xyz'
      }
    };

    this.props.fulcrumAPI.layers.create(layerObj, (error, resp) => {
      if (error) {
        console.log('Error creating layer: ', error);
        return this.showMessage('There was an error creating the tile layer.');
      }

      this.setState({layer: resp.layer});

      return this.showMessage(`Successfully created Fulcrum tile layer: ${resp.layer.name}`);
    });
  }

  checkDroneDeployTileLayers() {
    if (!this.props.droneDeployApi) {
      return;
    }

    this.props.droneDeployApi.Plans.getCurrentlyViewed()
      .then((plan) => {
        this.props.droneDeployApi.Tiles.get({planId: plan.id, layerName: 'ortho', zoom: 17})
          .then((tileInformation) => {
            if (tileInformation.template) {
              this.setState({tileLayerUrl: tileInformation.template});
            }
          });
      });
  }

  showMessage(message, timeout = 5000) {
    if (this.props.droneDeployApi) {
      return this.props.droneDeployApi.Messaging.showToast(message, {timeout: timeout});
    }

    return console.log(message);
  }
}

export default withRouter(TileLayers);
