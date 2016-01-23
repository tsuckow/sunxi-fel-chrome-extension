require("styles/ui.css")

import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  render() {
    return <h1>Hello</h1>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

chrome.usb.getDevices({},function(devices){
   if( devices.length > 0 ) {
      chrome.usb.openDevice(devices[0], function(handle) {
         if(!handle) {
            throwError(chrome.runtime.lastError.message);
         }
         console.log("Device",handle);
      });
   }
   console.log("Devices",devices, chrome.runtime.lastError);
});
