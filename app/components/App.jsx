import React from 'react';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import Fulcrum from 'fulcrum-app';
import { Form, Record } from 'fulcrum-core';
import classnames from 'classnames';
import series from 'async/series';

import { server, urlRoot } from '../constants';
import Header from './Header';
import Expanded from './Expanded';
import SignIn from './SignIn';
import SignOut from './SignOut';
import Annotations from './Annotations';
import FormPicker from './FormPicker';
import FieldPicker from './FieldPicker';
import PropsRoute from './PropsRoute';
import PrivateRoute from './PrivateRoute';

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

  render() {
    const expandedClassName = classnames({
      hidden: !this.state.expanded
    });

    return (
      <Router
        history={this.history}
        basename={urlRoot}>
        <div className="container expand-container">
          <Header
            expanded={this.state.expanded}
            onHeaderClick={this.handleHeaderClick} />
          <div className={expandedClassName}>
            <PropsRoute
              path="/sign-in"
              component={SignIn}
              onSignedIn={this.handleSignedIn}
              signedIn={this.state.signedIn} />
            <PropsRoute
              path="/sign-out"
              component={SignOut}
              onSignedOut={this.handleSignedOut} />
            <PrivateRoute
              path="/annotations"
              component={Annotations}
              redirectTo="/sign-in"
              signedIn={this.state.signedIn}
              droneDeployApi={this.state.droneDeployApi}
              onAnnotationsUpdated={this.handleAnnotationsUpdated}
              forms={this.state.forms} />
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
            <PropsRoute
              path="/expanded"
              component={Expanded}
              signedIn={this.state.signedIn}
              droneDeployApi={this.state.droneDeployApi}
              forms={this.state.forms} />
            <Redirect to="/expanded" />
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

  handleAnnotationsUpdated(annotations) {
    this.setState({annotations});
  }

  handleFormPicked(form) {
    this.setState({ selectedForm: form });
  }

  handleFieldPicked(selectedField) {
    this.setState({selectedField}, () => {
      this.syncAnnotations();
    });
  }

  syncAnnotation(annotation, callback) {
    const attributes = {
      latitude: annotation.geometry.lat,
      longitude: annotation.geometry.lng,
      form_values: {}
    };

    attributes.form_values[this.state.selectedField.key] = annotation.description;

    const record = new Record(attributes, this.state.selectedForm);

    const recordObject = {record: record.toJSON()};

    this.api.records.create(recordObject, callback);
  }

  syncAnnotations() {
    const tasks = this.state.annotations.map((annotation) => {
      return (callback) => {
        this.syncAnnotation(annotation, callback);
      };
    });

    series(tasks, this.onAnnotationsSyncd);
  }

  onAnnotationsSyncd(error, results) {
    if (error) {
      console.log('sync error');
      return console.log(error);
    }

    console.log('success');
    return console.log(results);
  }

  TOKEN_KEY = 'fulcrum_token';
}
