import React from 'react';
import { withRouter } from 'react-router';

class ScrollToTop extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.elem) {
        this.elem.scrollTop = 0;
      }
    }
  }

  render() {
    return (
      <div ref={(elem) => {
        this.elem = elem;
      }}>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(ScrollToTop);
