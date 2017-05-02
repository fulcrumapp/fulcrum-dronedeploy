import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

export default class Annotations extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired,
    fulcrumAPI: React.PropTypes.object.isRequired,
    onAnnotationsUpdated: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.handleRefreshCountClicked = this.handleRefreshCountClicked.bind(this);
    this.handleSyncButtonClicked = this.handleSyncButtonClicked.bind(this);
    this.handleLayerNameChange = this.handleLayerNameChange.bind(this);
    this.handleAddLayerButtonClicked = this.handleAddLayerButtonClicked.bind(this);

    this.state = {
      annotations: [],
      fulcrumLayers: null,
      layer: null,
      layerName: null,
      tileLayerUrl: null
    };

    this.checkDroneDeployTileLayers();
    this.checkAnnotations();
    this.checkFulcrumTileLayers();
  }

  render() {
    const count = this.state.annotations.length;

    let syncButton = null;
    let syncText = (
      <p>
        There are no annotations to sync to Fulcrum.
      </p>
    );

    if (count > 0) {
      syncButton = (
        <button onClick={this.handleSyncButtonClicked}>
          Sync Annotations
        </button>
      );

      syncText = (
        <p>
          There {count === 1 ? 'is' : 'are'} <strong>{count} annotation{count === 1 ? '' : 's'}</strong> to sync to Fulcrum.
        </p>
      );
    }

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
            Type a layer name below and click "Add Layer" below to add this drone imagery to Fulcrum.
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
          <Tabs className="tabs">
            <TabList className="tab-list">
              <Tab className="tab">Annotations</Tab>
              <Tab className="tab">Tile Layers</Tab>
            </TabList>

            <TabPanel className="tab-panel">
              <div className="row">
                {syncText}
              </div>
              <div className="row">
                <button onClick={this.handleRefreshCountClicked}>
                  Refresh Count
                </button>
              </div>
              <div className="row">
                {syncButton}
              </div>
            </TabPanel>
            <TabPanel className="tab-panel">
              <div className="row">
                {addLayerText}
              </div>
              <div className="row">
                {addLayerInput}
              </div>
              <div className="row">
                {addLayerButton}
              </div>
            </TabPanel>
          </Tabs>
        </div>
        <div className="row">
          <Link
            className="sign-out"
            to="/sign-out">
            Sign Out of Fulcrum
          </Link>
        </div>
      </div>
    );
  }

  handleLayerNameChange(event) {
    this.setState({ layerName: event.target.value.trim() });
  }

  handleRefreshCountClicked() {
    this.checkAnnotations();
  }

  handleSyncButtonClicked() {
    this.props.history.push('/form-picker');
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

      this.setState({fulcrumLayers: filteredLayers});
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
