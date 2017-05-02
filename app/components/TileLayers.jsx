import React from 'react';

export default class TileLayers extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired,
    fulcrumAPI: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.handleLayerNameChange = this.handleLayerNameChange.bind(this);
    this.handleAddLayerButtonClicked = this.handleAddLayerButtonClicked.bind(this);

    this.state = {
      fulcrumLayers: null,
      layer: null,
      layerName: null,
      tileLayerUrl: null
    };

    this.checkDroneDeployTileLayers();
    this.checkFulcrumTileLayers();
  }

  render() {
    let addLayerButton = null;
    let addLayerInput = null;
    let addLayerText = (
      <p>
        There are no tile layers to add to Fulcrum.
      </p>
    );

    if (this.state.tileLayerUrl) {
      addLayerButton = (
        <button onClick={this.handleAddLayerButtonClicked}>
          Add Layer to Fulcrum
        </button>
      );

      addLayerText = (
        <div>
          <p>
            Type a layer name below and click <strong>Add Layer</strong> below to add this drone imagery to Fulcrum.
          </p>
          <p>
            <strong>NOTE:</strong> Currently, layers added to Fulcrum expire after 30 days.
          </p>
        </div>
      );

      addLayerInput = (
        <div className="input-field col-4">
          <input
            onChange={this.handleLayerNameChange}
            type="text" />
          <label htmlFor="layer-name">Layer Name</label>
        </div>
      );
    }

    return (
      <div>
        <div className="row">
          {addLayerText}
        </div>
        <div className="row">
          {addLayerInput}
        </div>
        <div className="row">
          {addLayerButton}
        </div>
      </div>
    );
  }

  handleLayerNameChange(event) {
    this.setState({ layerName: event.target.value.trim() });
  }

  handleAddLayerButtonClicked() {
    const layerObj = {
      layer: {
        name: this.state.layerName,
        source: this.state.tileLayerUrl,
        type: 'xyz'
      }
    };

    this.props.fulcrumAPI.layers.create(layerObj, (error, resp) => {
      if (error) {
        return console.log('Error creating layer: ', error);
      }

      return console.log('Layer created: ', resp.layer);
    });
  }

  checkFulcrumTileLayers() {
    this.props.fulcrumAPI.layers.search({type: 'xyz'}, (error, resp) => {
      if (error) {
        return console.log('Error searching layers: ', error);
      }

      const filteredLayers = resp.layers.filter((layer) => {
        return layer.type === 'xyz';
      });

      return this.setState({fulcrumLayers: filteredLayers});
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
}
