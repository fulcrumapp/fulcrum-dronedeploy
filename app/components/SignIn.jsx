import React from 'react';
import request from 'superagent';

import { server } from '../constants';

require('./SignIn.css');

class Context extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onContextChosen: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onContextChosen(this.props.id);
  }

  render() {
    return (
      <div className="row button-row">
        <button onClick={this.onClick} key={this.props.id}>{this.props.name}</button>
      </div>
    );
  }
}

export default class SignIn extends React.Component {
  static propTypes = {
    onSignedIn: React.PropTypes.func.isRequired
  }

  TIMEOUT = 3600;

  constructor() {
    super();

    this.onEmailChange = this.onEmailChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onContextChosen = this.onContextChosen.bind(this);

    this.state = {
      email: '',
      password: '',
      contexts: null
    };
  }

  onContextChosen(id) {
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
          window.alert('There was a problem signing in.');
        } else {
          this.props.onSignedIn(resp.body.authorization.token);
        }
      });
  }

  onFormSubmit(event) {
    const email = this.state.email;
    const password = this.state.password;

    if (email.length > 0 && password.length > 0) {
      request
        .get(`${server}api/v2/users`)
        .set('Accept', 'application/json')
        .set('Authorization', this.getAuthHeader())
        .end((error, resp) => {
          if (error) {
            window.alert('There was a problem signing in.');
          } else {
            this.setState({ contexts: resp.body.user.contexts });
          }
        });
    }

    event.preventDefault();
  }

  onEmailChange(event) {
    this.setState({ email: event.target.value.trim() });
  }

  onPasswordChange(event) {
    this.setState({ password: event.target.value.trim() });
  }

  getAuthHeader() {
    const email = this.state.email;
    const password = this.state.password;
    const auth = window.btoa(`${email}:${password}`);

    return `Basic ${auth}`;
  }

  render() {
    if (this.state.contexts) {
      return (
        <div>
          {this.state.contexts.map((context) => {
            return <Context
              key={context.id}
              id={context.id}
              name={context.name}
              onContextChosen={this.onContextChosen}
            />;
          })}
        </div>
      );
    } else {
      return (
        <form onSubmit={this.onFormSubmit}>
          <div className="row">
            <div className="input-field col-4">
              <input onChange={this.onEmailChange} type="text" className="validate" name="email" id="email" autoFocus="true" />
              <label htmlFor="email">Email</label>
            </div>
          </div>

          <div className="row">
            <div className="input-field col-4">
              <input onChange={this.onPasswordChange} type="password" className="validate" id="password" />
              <label htmlFor="password">Password</label>
            </div>
          </div>

          <div className="row">
            <div className="col-4">
              <button type="submit">Sign Into Fulcrum</button>
            </div>
          </div>
        </form>
      );
    }
  }
}
