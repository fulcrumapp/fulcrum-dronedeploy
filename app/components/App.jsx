import React from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import Fulcrum from 'fulcrum-app';
import { Form } from 'fulcrum-core';
import classnames from 'classnames';

import { server, urlRoot } from '../constants';
import Header from './Header';
import Expanded from './Expanded';
import SignIn from './SignIn';
import SignOut from './SignOut';
import Annotations from './Annotations';
import PropsRoute from './PropsRoute';
import PrivateRoute from './PrivateRoute';

require('./App.css');

export default class App extends React.Component {
  constructor() {
    super();

    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSignedIn = this.handleSignedIn.bind(this);
    this.handleSignedOut = this.handleSignedOut.bind(this);

    this.signInPath = '*sign-in*';
    this.signOutPath = '*sign-out*';
    this.annotationsPath = '*annotations*';
    this.expandedPath = '*expanded*';

    this.expandedPathTo = `${urlRoot}expanded`;

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
    const expandedClassName = classnames({
      hidden: !this.state.expanded
    });

    return (
      <Router>
        <div className="container expand-container">
          <Header
            expanded={this.state.expanded}
            onHeaderClick={this.handleHeaderClick} />
          <div className={expandedClassName}>
            <PropsRoute
              path={this.signInPath}
              component={SignIn}
              onSignedIn={this.handleSignedIn}
              signedIn={this.state.signedIn} />
            <PropsRoute
              path={this.signOutPath}
              component={SignOut}
              onSignedOut={this.handleSignedOut} />
            <PrivateRoute
              path={this.annotationsPath}
              component={Annotations}
              redirectTo={this.signInPath}
              signedIn={this.state.signedIn}
              droneDeployApi={this.state.droneDeployApi}
              forms={this.state.forms} />
            <PropsRoute
              path="*expanded*"
              component={Expanded}
              signedIn={this.state.signedIn}
              droneDeployApi={this.state.droneDeployApi}
              forms={this.state.forms} />
            <Redirect to={this.expandedPathTo} />
          </div>
        </div>
      </Router>
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
