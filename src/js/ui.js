require('styles/ui.css');

import React from 'react';
import ReactDOM from 'react-dom';

import DeviceSelector from 'components/deviceSelector.jsx';

import usb from 'services/usb.js';

class App extends React.Component {
  componentDidMount() {
    setInterval(usb.checkForDevices.bind(usb),1000);
  }

  render() {
    return <DeviceSelector />;
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
/*
chrome.usb.findDevices({vendorId:0x1f3a,productId:0xefe8},function(devices){
  console.log(devices, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
  chrome.usb.listInterfaces( devices[0], function(info){
    console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
  });
})
*/
chrome.usb.getDevices({},function(devices){
   if( devices.length > 0 ) {
      chrome.usb.openDevice(devices[0], function(handle) {
         if(!handle) {
            console.error(chrome.runtime.lastError.message);
            return;
         }
         console.log("Device",handle);

         chrome.usb.listInterfaces( handle, function(info){
           console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
         });
/*
         chrome.usb.claimInterface( handle, 0,  function(info){
           console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
         })
*/
/*
         var buffer = new ArrayBuffer(32);
         var view = new DataView(buffer);
         view.setUint32(0, 0x41575543, false); //AWUC
         view.setUint32(4, 0, true);
         view.setUint32(8, 16, true);
         view.setUint16(12, 0, true);
         view.setUint8(14, 0);
         view.setUint8(15, 0);
         view.setUint8(16, 0xC);
         view.setUint8(17, 0x12); // Write
         view.setUint32(18, 16, true);
         //Reserved 0
         //view.setUint64(22, 0, true);
         //view.setUint16(30, 0, true);

         chrome.usb.bulkTransfer(handle, {
           direction: 'out',
           endpoint: 0,
           data: buffer
         }, function(info){
           console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
           var buffer = new ArrayBuffer(16);
           var view = new DataView(buffer);
           view.setUint16(0, 0x1, true); //FEL_VERIFY_DEVICE
           view.setUint16(2, 0, true);
           //Reserved 0
           //view.setUint64(4, 0, true);
           //view.setUint32(12, 0, true);

           chrome.usb.bulkTransfer(handle, {
             direction: 'out',
             endpoint: 0,
             data: buffer
           }, function(info){
             console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
             chrome.usb.bulkTransfer(handle, {
               direction: 'in',
               endpoint: 0,
               length: 13
             }, function(info){
               console.log(info, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
             })
           })
         })
*/

      });
   }
   console.log("Devices",devices, chrome.runtime.lastError ? chrome.runtime.lastError.message : undefined);
});
