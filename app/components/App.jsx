import React from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import Fulcrum from 'fulcrum-app';
import { Form } from 'fulcrum-core';
import classnames from 'classnames';

import { server, urlRoot, tokenKey } from '../constants';
import Header from './Header';
import Expanded from './Expanded';
import SignIn from './SignIn';
import SignOut from './SignOut';
import Annotations from './Annotations';
import AnnotationsSyncer from './AnnotationsSyncer';
import FormPicker from './FormPicker';
import FieldPicker from './FieldPicker';
import PropsRoute from './PropsRoute';
import PrivateRoute from './PrivateRoute';
import ScrollToTop from './ScrollToTop';

require('./App.css');

export default class App extends React.Component {
  constructor() {
    super();

    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleSignedIn = this.handleSignedIn.bind(this);
    this.handleSignedOut = this.handleSignedOut.bind(this);
    this.handleFormPicked = this.handleFormPicked.bind(this);
    this.handleFieldPicked = this.handleFieldPicked.bind(this);
    this.handleAnnotationsUpdated = this.handleAnnotationsUpdated.bind(this);
    this.handleAnnotationsSyncd = this.handleAnnotationsSyncd.bind(this);
    this.showMessage = this.showMessage.bind(this);

    this.history = createHistory();

    this.state = {
      expanded: false,
      signedIn: false,
      droneDeployApi: null,
      annotations: [],
      selectedForm: null,
      selectedField: null
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

  componentDidUpdate() {
    document.body.style.height = (this.state.expanded ? '360px' : '60px');
  }

  render() {
    const expandedClassName = classnames({
      expanded: true,
      hidden: !this.state.expanded
    });

    return (
      <Router
        history={this.history}
        basename={urlRoot}>
        <ScrollToTop>
          <div className="container expand-container">
            <Header
              expanded={this.state.expanded}
              onHeaderClick={this.handleHeaderClick} />
            <div className={expandedClassName}>
              <PropsRoute
                path="/sign-in"
                component={SignIn}
                onSignedIn={this.handleSignedIn}
                signedIn={this.state.signedIn}
                showMessage={this.showMessage} />
              <PropsRoute
                path="/sign-out"
                component={SignOut}
                onSignedOut={this.handleSignedOut} />
              <PrivateRoute
                path="/form-picker"
                component={FormPicker}
                redirectTo="/sign-in"
                signedIn={this.state.signedIn}
                forms={this.state.forms}
                onFormPicked={this.handleFormPicked} />
              <PrivateRoute
                path="/field-picker"
                component={FieldPicker}
                redirectTo="/sign-in"
                signedIn={this.state.signedIn}
                selectedForm={this.state.selectedForm}
                onFieldPicked={this.handleFieldPicked} />
              <PrivateRoute
                path="/annotations-syncer"
                component={AnnotationsSyncer}
                redirectTo="/sign-in"
                signedIn={this.state.signedIn}
                annotations={this.state.annotations}
                selectedForm={this.state.selectedForm}
                selectedField={this.state.selectedField}
                fulcrumAPI={this.api}
                onAnnotationsSyncd={this.handleAnnotationsSyncd} />
              <PropsRoute
                path="/expanded"
                component={Expanded}
                signedIn={this.state.signedIn}
                droneDeployApi={this.state.droneDeployApi}
                onAnnotationsUpdated={this.handleAnnotationsUpdated}
                forms={this.state.forms}
                fulcrumAPI={this.api} />
              <Redirect to="/expanded" />
            </div>
          </div>
        </ScrollToTop>
      </Router>
    );
  }

  checkSignedInState() {
    const token = window.sessionStorage.getItem(tokenKey);

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
    window.sessionStorage.setItem(tokenKey, token);
    this.setState({ signedIn: true });
    this.checkSignedInState();
    this.state.droneDeployApi.Track.successCondition();
  }

  handleSignedOut() {
    window.sessionStorage.removeItem(tokenKey);
    this.setState({ signedIn: false });
  }

  handleAnnotationsUpdated(annotations) {
    this.setState({annotations});
  }

  handleFormPicked(form) {
    this.setState({ selectedForm: form });
  }

  handleFieldPicked(selectedField) {
    this.setState({selectedField});
  }

  handleAnnotationsSyncd(error, results) {
    if (error) {
      console.log('sync error');
      console.log(error);

      return this.showMessage('There was an error syncing annotations.');
    }

    return this.showMessage(results.length + ' annotation(s) syncd.');
  }

  showMessage(message, timeout = 5000) {
    if (this.state.droneDeployApi) {
      return this.state.droneDeployApi.Messaging.showToast(message, {timeout: timeout});
    }

    return console.log(message);
  }
}
