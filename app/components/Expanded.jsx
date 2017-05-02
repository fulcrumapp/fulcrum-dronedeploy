import React from 'react';
import { Link } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Annotations from './Annotations';
import TileLayers from './TileLayers';

export default class Expanded extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired,
    fulcrumAPI: React.PropTypes.object.isRequired,
    onAnnotationsUpdated: React.PropTypes.func.isRequired
  }

  render() {
    return (
      <div>
        <div className="row">
          <Tabs className="tabs">
            <TabList className="tab-list">
              <Tab className="tab">Annotations</Tab>
              <Tab className="tab">Tile Layers</Tab>
            </TabList>
            <TabPanel className="tab-panel">
              <Annotations
                droneDeployApi={this.props.droneDeployApi}
                onAnnotationsUpdated={this.props.onAnnotationsUpdated} />
            </TabPanel>
            <TabPanel className="tab-panel">
              <TileLayers
                droneDeployApi={this.props.droneDeployApi}
                fulcrumAPI={this.props.fulcrumAPI} />
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
}
