import React from 'react';

import SignIn from './SignIn';
import Annotations from './Annotations';

require('./Expanded.css');

export default class Expanded extends React.Component {
  static propTypes = {
    expanded: React.PropTypes.bool.isRequired,
    signedIn: React.PropTypes.bool.isRequired,
    droneDeployApi: React.PropTypes.object.isRequired,
    onSignedIn: React.PropTypes.func.isRequired,
    onSignedOut: React.PropTypes.func.isRequired,
    forms: React.PropTypes.array.isRequired
  }

  render() {
    if (this.props.expanded) {
      if (this.props.signedIn) {
        return (
          <div>
            <div className="row">
              <Annotations
                droneDeployApi={this.props.droneDeployApi}
                forms={this.props.forms} />
            </div>
            <div className="row">
              <button
                className="sign-out-button"
                onClick={this.props.onSignedOut}>Sign Out of Fulcrum</button>
            </div>
          </div>
        );
      }
      return (
        <SignIn onSignedIn={this.props.onSignedIn} />
      );
    }

    return null;
  }
}
