// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import HueLight from './hue_light';
import Log from '../../log';
import request from 'request';

// Address at which we will authenticate against the bridge.
const HUE_BRIDGE_AUTH_ADDRESS = 'http://{ip}/api';

// Address at which the bridge will give us a list of all available Hue lights.
const HUE_BRIDGE_LIGHTS_ADDRESS = 'http://{ip}/api/{username}/lights';

// Object representing a Hue bridge.
export default class HueBridge {
  constructor(details) {
    this.address_ = details.internalipaddress;
    this.id_ = details.id;
    this.lights_ = [];
    this.username_ = null;
  }

  // Initializes this bridge.
  initialize(device_type) {
    return this.authenticate(device_type).then(success => {
      if (!success)
        return;  // happens when the LINK button still has to be clicked.

      return this.findLights();
    });
  }

  // Authenticates with the Hue bridge. The bridge will remember the authentication information
  // based on the given |device_type| and the IP address of this node.
  authenticate(device_type) {
    let request_options = {
      url: this.localAddress(HUE_BRIDGE_AUTH_ADDRESS),
      method: 'POST',
      json: {
        devicetype: device_type
      }
    };

    return new Promise((resolve, reject) => {
      request(request_options, (error, response, body) => {
        if (error)
          reject(error);

        if (response.statusCode != 200 || !body.length)
          return reject('Hue: Unexpected response from bridge: ' + response.statusMessage);

        body = body[0];

        // Handle the case in which the Node server has not yet authenticated with the bridge. The
        // button on the physical bridge must be pressed in that case.
        if (body.error) {
          Log.warning('Hue: Error from bridge ' + this.address_ + ' (' + body.error.type + '): '
                          + body.error.description);
          return resolve(false);
        }

        // Store the username we retrieved from the Hue for this session.
        this.username_ = body.success.username;

        resolve(true);
      });
    });
  }

  // Connects to the Hue bridge to find a list of the available lights, and swaps out the local
  // lights_ property when the list has been created successfully.
  findLights() {
    return new Promise((resolve, reject) => {
      request(this.localAddress(HUE_BRIDGE_LIGHTS_ADDRESS), (error, response, body) => {
        if (error)
          reject(error);

        if (response.statusCode != 200)
          return reject('Hue: Unexpected response from bridge: ' + response.statusMessage);

        // Handle the case in which the Node server has not yet authenticated with the bridge. The
        // button on the physical bridge must be pressed in that case.
        if (body.error) {
          Log.warning('Hue: Error from bridge ' + this.address_ + ' (' + body.error.type + '): '
                          + body.error.description);
          return resolve();
        }

        body = JSON.parse(body);

        this.lights_ = [];
        Object.keys(body).forEach(key => {
          this.lights_.push(new HueLight(body[key], key, this));
        });

        resolve();
      });
    });
  }

  // Returns the IP address that this HueBridge object represents.
  getAddress() { return this.address_; }

  // Returns the id of the bridge that this HueBridge object represents.
  getId() { return this.id_; }

  // Returns the number of lights owned by this bridge.
  getLightCount() { return this.lights_.length; }

  // Returns an array of lights owned by this bridge.
  getLights() { return this.lights_; }

  // Returns the username using which this instance has authenticated with the bridge.
  getUsername() { return this.username_; }

  // PRIVATE utility function for localizing an API address constant.
  localAddress(address) {
    return address.replace('{ip}', this.address_)
                  .replace('{username}', this.username_);
  }
};
