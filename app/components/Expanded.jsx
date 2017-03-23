import React from 'react';

import SignIn from './SignIn';

require('./Expanded.css');

export default class Expanded extends React.Component {
  static propTypes = {
    expanded: React.PropTypes.bool.isRequired,
    signedIn: React.PropTypes.bool.isRequired,
    onSignedOut: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    expanded: false
  }

  constructor(props) {
    super(props);

    this.state = {
      expanded: props.expanded,
      signedIn: props.signedIn
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: nextProps.expanded,
      signedIn: nextProps.signedIn
    });
  }

  render() {
    if (this.state.expanded) {
      if (this.state.signedIn) {
        return (
          <div className="row">
            <h3>You Are Signed In.</h3>
            <button onClick={this.props.onSignedOut}>Sign Out</button>
          </div>
        );
      } else {
        return (
          <SignIn onSignedIn={this.props.onSignedIn} />
        );
      }
    } else {
      return null;
    }
  }
}
