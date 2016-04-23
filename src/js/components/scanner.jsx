import React from 'react';
import classNames from 'classnames';

import 'styles/scanner.less';

export default class Scanner extends React.Component {
  render() {
    let clazz = classNames('loader', {
      loaded: this.props.loaded,
      loading: !this.props.loaded,
      error: this.props.error,
    });

    return <div className={clazz}>
      <div className="center"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>;
  }
}
