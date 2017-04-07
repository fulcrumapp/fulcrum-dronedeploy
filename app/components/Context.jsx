import React from 'react';

export default class Context extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onContextChosen: React.PropTypes.func.isRequired
  }

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="row">
        <button
          onClick={this.handleClick}
          key={this.props.id}>{this.props.name}</button>
      </div>
    );
  }

  handleClick() {
    this.props.onContextChosen(this.props.id);
  }
}
