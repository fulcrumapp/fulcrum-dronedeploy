import React from 'react';
import request from 'superagent';
import { Redirect } from 'react-router-dom';

import { server } from '../constants';
import Context from './Context';

require('./SignIn.css');

export default class SignIn extends React.Component {
  static propTypes = {
    onSignedIn: React.PropTypes.func.isRequired,
    signedIn: React.PropTypes.bool.isRequired,
    showMessage: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleContextChosen = this.handleContextChosen.bind(this);

    this.state = {
      email: '',
      password: '',
      contexts: null
    };
  }

  render() {
    if (this.props.signedIn) {
      return (
        <Redirect to="/expanded" />
      );
    }

    if (this.state.contexts !== null) {
      if (this.state.contexts.length === 0) {
        return this.props.showMessage('API access is not enabled for your Fulcrum account.');
      }

      if (this.state.contexts.length === 1) {
        return this.handleContextChosen(this.state.contexts[0].id);
      }

      return (
        <div>
          <div className="row">
            <p>
              Select an organization to sign into.
            </p>
          </div>
          <div>
            {this.state.contexts.map((context) => {
              return (<Context
                key={context.id}
                id={context.id}
                name={context.name}
                onContextChosen={this.handleContextChosen} />
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleFormSubmit}>
        <div className="row">
          <div className="input-field col-4">
            <input
              onChange={this.handleEmailChange}
              type="text"
              className="validate"
              name="email"
              id="email"
              autoFocus="true" />
            <label htmlFor="email">Email</label>
          </div>
        </div>

        <div className="row">
          <div className="input-field col-4">
            <input
              onChange={this.handlePasswordChange}
              type="password"
              className="validate"
              id="password" />
            <label htmlFor="password">Password</label>
          </div>
        </div>

        <div className="row">
          <div className="col-4">
            <button type="submit">Sign Into Fulcrum</button>
          </div>
        </div>

        <div className="row">
          <p className="no-account">
            Don't have a Fulcrum account?
          </p>
          <p className="no-account last">
            <a
              target="_blank"
              href="https://web.fulcrumapp.com/users/sign_up/">
              Sign up
            </a> for free.
          </p>
        </div>
      </form>
    );
  }

  handleContextChosen(id) {
    const data = {
      authorization: {
        organization_id: id,
        note: 'Drone Deploy Client',
        timeout: this.TIMEOUT
      }
    };

    request
      .post(`${server}api/v2/authorizations`)
      .send(data)
      .set('Accept', 'application/json')
      .set('Authorization', this.getAuthHeader())
      .end((error, resp) => {
        if (error) {
          this.props.showMessage('There was a problem signing in.');
        } else {
          this.props.onSignedIn(resp.body.authorization.token);
          this.render();
        }
      });
  }

  handleFormSubmit(event) {
    const { email, password } = this.state;

    if (email.length > 0 && password.length > 0) {
      request
        .get(`${server}api/v2/users`)
        .set('Accept', 'application/json')
        .set('Authorization', this.getAuthHeader())
        .end((error, resp) => {
          if (error) {
            this.props.showMessage('There was a problem signing in.');
          } else {
            const contexts = resp.body.user.contexts.filter(context => context.role.can_manage_authorizations);
            this.setState({ contexts });
          }
        });
    }

    event.preventDefault();
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value.trim() });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value.trim() });
  }

  getAuthHeader() {
    const { email, password } = this.state;
    const auth = window.btoa(`${email}:${password}`);

    return `Basic ${auth}`;
  }

  TIMEOUT = 60 * 60 * 24;
}
