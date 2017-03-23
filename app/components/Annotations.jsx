import React from 'react';

require('./Expanded.css');

export default class Annotations extends React.Component {
  static propTypes = {
    droneDeployApi: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      annotations: []
    };

    this.props.droneDeployApi.Plans.getCurrentlyViewed()
      .then((plan) => {
        return this.props.droneDeployApi.Annotations.get(plan.id, { comments: true });
      })
      .then((annotations) => {
        const filteredAnnotations = annotations.filter((annotation) => {
          return annotation.type === 'marker';
        });

        if (filteredAnnotations && filteredAnnotations.length > 0) {
          this.setState({ annotations: filteredAnnotations });
        }
      })
      .catch((error) => {
        console.log('error: ', error);
      });
  }

  render() {
    if (this.state.annotations) {
      return (
        <div>
          {this.state.annotations.map((annotation) => {
            return <p>{annotation.description}</p>;
          })}
        </div>
      )
    }
    return (
      <p>No annotations.</p>
    );
  }
}
