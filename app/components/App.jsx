import React from 'react';
import Fulcrum from 'fulcrum-app';
import { Form } from 'fulcrum-core';

import { server } from '../constants';
import Header from './Header';
import Expanded from './Expanded';

require('./App.css');

export default class App extends React.Component {
  constructor() {
    super();

    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSignedIn = this.handleSignedIn.bind(this);
    this.handleSignedOut = this.handleSignedOut.bind(this);

    this.state = {
      expanded: false,
      signedIn: false,
      droneDeployApi: null
    };

    /*eslint-disable */
    if (window.dronedeploy) {
      dronedeploy.onload(() => {
        this.state.droneDeployApi = dronedeploy;
      });
    }
    /*eslint-enable */

    this.checkSignedInState();
  }

  render() {
    return (
      <div className="container expand-container">
        <Header
          expanded={this.state.expanded}
          onHeaderClick={this.handleHeaderClick} />
        <Expanded
          expanded={this.state.expanded}
          signedIn={this.state.signedIn}
          droneDeployApi={this.state.droneDeployApi}
          onSignedIn={this.handleSignedIn}
          onSignedOut={this.handleSignedOut}
          forms={this.state.forms} />
      </div>
    );
  }

  checkSignedInState() {
    const token = window.sessionStorage.getItem(this.TOKEN_KEY);

    if (token) {
      this.api = new Fulcrum({
        api_key: token,
        url: `${server}api/v2/`
      });

      this.api.forms.search({}, (error, response) => {
        if (error) {
          this.api = null;
        } else {
          const forms = response.forms.map((formObj) => {
            return new Form(formObj);
          });

          this.setState({ signedIn: true, forms });
        }
      });
    }
  }

  handleHeaderClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  handleSignedIn(token) {
    window.sessionStorage.setItem(this.TOKEN_KEY, token);
    this.setState({ signedIn: true });
    this.checkSignedInState();
  }

  handleSignedOut() {
    window.sessionStorage.removeItem(this.TOKEN_KEY);
    this.setState({ signedIn: false });
  }

  TOKEN_KEY = 'fulcrum_token';
}
