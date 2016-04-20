import React from 'react';

import 'styles/scanner.less';

export default class Scanner extends React.Component {
  render() {
    return <div className={'loader ' + (this.props.loaded?'loaded':'loading')}>
      <div className="center"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>;
  }
}
