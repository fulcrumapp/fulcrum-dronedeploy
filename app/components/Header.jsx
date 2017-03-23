import React from 'react';

require('./Header.css');

export default class Header extends React.Component {
  static propTypes = {
    expanded: React.PropTypes.bool.isRequired,
    onHeaderClick: React.PropTypes.func.isRequired
  }

  static defaultProps = {
    expanded: false
  }

  constructor(props) {
    super(props);

    this.state = {
      expanded: props.expanded
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      expanded: nextProps.expanded
    });
  }

  render() {
    const upOrDown = this.state.expanded ? 'up' : 'down';
    const arrowUrl = `https://s3.amazonaws.com/drone-deploy-plugins/templates/login-example-imgs/arrow-${upOrDown}.svg`;

    return (
      <div onClick={this.props.onHeaderClick} className="row expand-row">
        <div className="col-3">
          <span className="lead vert-center"><img className="logo" src="img/logo.svg" alt="Fulcrum" /> </span>
        </div>
        <div className="col-1 right">
          <i>
            <img src={arrowUrl} alt="collapse" className="expand-arrow" />
          </i>
        </div>
      </div>
    );
  }
}
