import _ from 'lodash';

import Enum from 'utils/enum.js';

import dispatcher from 'dispatcher.js';

const States = new Enum('RESET','OPENING_DEVICE','LISTING_INTERFACE','CLAIMING_INTERFACE','ERROR');

const USB_TIMEOUT = 1000;

const AW_USB_READ = 0x11;
const AW_USB_WRITE = 0x12;

const FEL_VERIFY = 0x001;
const FEL_DOWNLOAD = 0x101; //To Device
const FEL_RUN = 0x102; //Execute address
const FEL_UPLOAD = 0x103; //From Device

function getDataUSBRequest(cmd,length) {
  let buffer = new ArrayBuffer(32);
  let view = new DataView(buffer);
  view.setUint32(0,0x41575543,false);//"AWUC"
  view.setUint32(8,length,true);//len1
  view.setUint8(15,0x0C);//"cmd_len"
  view.setUint8(16,cmd);//"cmd"
  view.setUint32(18,length,true);//len2
  return buffer;
}

function getDataFELStandardRequest(cmd) {
  let buffer = new ArrayBuffer(16);
  let view = new DataView(buffer);
  view.setUint16(0,cmd,true);
  return buffer;
}

class FEL {
  constructor() {
    this.state = States.RESET;
    this.device = null;
    this.connection = null;
    this.interface = null;
    this.endpointIn = null;
    this.endpointOut = null;
    this.error = null;
    dispatcher.register(this.onDispatch.bind(this));
  }

  onDispatch(action) {
    if (action.actionType === 'devices-change' && this.device !== null) {
      if( !_.includes(_.map(action.devices,'device'), this.device.device) ) {
        console.warn('Device removed while handling FEL');
        this.reset();
      }
    }
  }

  reset() {
    if( this.connection ) {
      if( this.interface ) {
        chrome.usb.releaseInterface(this.connection,this.interface,() => {});
        this.interface = null;
      }

      chrome.usb.closeDevice(this.connection,() => {});
      this.connection = null;
    }

    this.device = null;
    this.endpointIn = null;
    this.endpointOut = null;
    this.state = States.RESET;
    this.error = null;
  }

  bulkTransfer(transfer) {
    return new Promise((resolve, reject) =>
      chrome.usb.bulkTransfer(this.connection, transfer,(result) => {
          if( chrome.runtime.lastError ) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(result);
          }
        }
      )
    );
  }

  bulkTransferIn(length) {
    return this.bulkTransfer({ direction: 'in', endpoint: this.endpointIn, length: length, timeout: USB_TIMEOUT });
  }

  bulkTransferOut(data) {
    return this.bulkTransfer({ direction: 'out', endpoint: this.endpointOut, data: data, timeout: USB_TIMEOUT });
  }

  onClaimedInterface(connection, interfaceNumber) {
    if(!chrome.runtime.lastError) {
      if( this.connection === connection ) {
        console.log('Claimed');
        /*
        let transfer = { direction: 'out', endpoint: this.endpointOut, data: getDataUSBRequest( AW_USB_WRITE, 16 ), timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode));
        transfer = { direction: 'out', endpoint: this.endpointOut, data: getDataFELStandardRequest( FEL_VERIFY ), timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode));
        transfer = { direction: 'in', endpoint: this.endpointIn, length: 13, timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode,new Uint8Array(result.data)));

        transfer = { direction: 'out', endpoint: this.endpointOut, data: getDataUSBRequest( AW_USB_READ, 32 ), timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode));
        transfer = { direction: 'in', endpoint: this.endpointIn, length: 32, timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode,new Uint8Array(result.data)));
        transfer = { direction: 'in', endpoint: this.endpointIn, length: 13, timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode,new Uint8Array(result.data)));

        transfer = { direction: 'out', endpoint: this.endpointOut, data: getDataUSBRequest( AW_USB_READ, 8 ), timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode));
        transfer = { direction: 'in', endpoint: this.endpointIn, length: 8, timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode,new Uint8Array(result.data)));
        transfer = { direction: 'in', endpoint: this.endpointIn, length: 13, timeout: 1000 };
        chrome.usb.bulkTransfer(this.connection, transfer,(result) => console.log(result.resultCode,new Uint8Array(result.data)));
        */

        Promise.resolve(null)
        .then(() => this.bulkTransferOut(getDataUSBRequest( AW_USB_WRITE, 16 )))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferOut(getDataFELStandardRequest( FEL_VERIFY )))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferIn(13))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))

        .then(() => this.bulkTransferOut(getDataUSBRequest( AW_USB_READ, 32 )))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferIn(32))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferIn(13))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))

        .then(() => this.bulkTransferOut(getDataUSBRequest( AW_USB_READ, 8 )))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferIn(8))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)))
        .then(() => this.bulkTransferIn(13))
        .then((result) => console.log(result.resultCode,new Uint8Array(result.data)));
      } else {
        console.warn('Claimed interface to a different device... Closing and ignoring');
        chrome.usb.releaseInterface(connection,interfaceNumber,() => {});
        chrome.usb.closeDevice(connection,() => {});
      }
    } else {
      console.error('Failed to claim interface. Last error:', chrome.runtime.lastError.message);
      if( this.connection === connection ) {
        this.state = States.ERROR;
        this.error = 'Failed to claim interface';
        //TODO: Dispatch error?
      }
    }
  }

  onListInterfaces(connection, interfaces) {
    if(interfaces) {
      if( this.connection === connection ) {
        console.log('Interfaces listed ', interfaces);
        if(
          interfaces.length > 0 &&
          interfaces[0].interfaceNumber === 0 &&
          interfaces[0].endpoints.length >= 2
        ) {

          this.endpointIn = _.find(interfaces[0].endpoints, (e) => e.direction === 'in' && e.type === 'bulk');
          this.endpointOut = _.find(interfaces[0].endpoints, (e) => e.direction === 'out' && e.type === 'bulk');

          if( this.endpointIn && this.endpointOut ) {
            this.endpointIn = this.endpointIn.address;
            this.endpointOut = this.endpointOut.address;
            this.state = States.CLAIMING_INTERFACE;
            this.interface = interfaces[0].interfaceNumber;
            chrome.usb.claimInterface(this.connection,this.interface,this.onClaimedInterface.bind(this, this.connection, this.interface));
          } else {
            console.error('Failed to locate endpoints');
            this.state = States.ERROR;
            this.error = 'Failed to locate endpoints';
            //TODO: Dispatch error?
          }
        }
      } else {
        console.warn('Listed interfaces to a different device... Closing and ignoring');
        chrome.usb.closeDevice(connection,() => {});
      }
    } else {
      console.error('Failed to list interfaces. Last error:', chrome.runtime.lastError.message);
      if( this.connection === connection ) {
        this.state = States.ERROR;
        this.error = 'Failed to list interfaces';
        //TODO: Dispatch error?
      }
    }
  }

  onOpenDevice(device, connection) {
    if(connection) {
      if( this.device === device ) {
        this.connection = connection;
        this.state = States.LISTING_INTERFACE;
        console.log('Device open');
        chrome.usb.listInterfaces(this.connection,this.onListInterfaces.bind(this, this.connection));
      } else {
        console.warn('Opened a connection to a different device... Closing and ignoring');
        chrome.usb.closeDevice(connection,() => {});
      }
    } else {
      console.error('Failed to open device. Last error:', chrome.runtime.lastError.message);
      if( this.device === device ) {
        this.state = States.ERROR;
        this.error = 'Failed to open device';
        //TODO: Dispatch error?
      }
    }
  }

  handleDevice(device) {
    if( this.state === States.RESET ) {
      this.device = device;
      this.state = States.OPENING_DEVICE;
      console.log('Opening FEL Device');
      chrome.usb.openDevice(this.device, this.onOpenDevice.bind(this, this.device));
    } else {
      console.error('Attempt to start FEL operation when one is already in progress.');
    }
  }
}

export default new FEL();
