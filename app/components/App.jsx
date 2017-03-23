import React from 'react';
import Fulcrum from 'fulcrum-app';
import { Form } from 'fulcrum-core';

import { server } from '../constants';
import Header from './Header';
import Expanded from './Expanded';

require('./App.css');

export default class App extends React.Component {
  TOKEN_KEY = 'fulcrum_token';

  constructor() {
    super();

    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.onSignedIn = this.onSignedIn.bind(this);
    this.onSignedOut = this.onSignedOut.bind(this);

    this.state = {
      expanded: false,
      signedIn: false
    };

    this.checkSignedInState();
  }

  onHeaderClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  onSignedIn(token) {
    sessionStorage.setItem(this.TOKEN_KEY, token);
    this.setState({ signedIn: true });
    this.checkSignedInState();
  }

  onSignedOut() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.setState({ signedIn: false });
  }

  checkSignedInState() {
    const token = sessionStorage.getItem(this.TOKEN_KEY);

    if (token) {
      this.api = new Fulcrum({
        api_key: token,
        url: `${server}api/v2/`
      });

      this.api.forms.search({}, (error, response) => {
        if (error) {
          this.api = null;
        } else {
          const forms = response.forms.map(function (formObj) {
            return new Form(formObj);
          });

          this.setState({ signedIn: true, forms });
        }
      });
    }
  }

  render() {
    return (
      <div className="container expand-container">
        <Header
          expanded={this.state.expanded}
          onHeaderClick={this.onHeaderClick}
        />
        <Expanded
          expanded={this.state.expanded}
          signedIn={this.state.signedIn}
          onSignedIn={this.onSignedIn}
          onSignedOut={this.onSignedOut}
        />
      </div>
    );
  }
}
