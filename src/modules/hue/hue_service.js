// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import HueBridge from './hue_bridge';
import Log from '../../log';
import request from 'request';

// Type of device as which this service will identify itself to the bridges.
const HUE_DEVICE_TYPE = 'node-home-server';

// Philips-provided broker server discovery address for local bridges.
const HUE_PHILIPS_UPNP_API = 'https://www.meethue.com/api/nupnp';

// The Hue service is the base object for communicating with the Hue bridges and lights. It will
// be initialized by finding the local bridges, authenticating to them and caching the available
// lights, whereas periodic updates can keep the information up to date where necessary.
export default class HueService {
  constructor() {
    this.bridges_ = [];
    this.initialize_promise_ = null;
  }

  // Begins initializing the Hue service by connecting to the bridge and caching all information
  // required in order to be able to quickly respond to incoming requests.
  initialize() {
    this.initialize_promise_ =
        this.findBridges().then(bridges => {
          if (!bridges.length)
            return [];

          this.bridges_ = bridges.map(details => new HueBridge(details));

          return Promise.all(
              this.bridges_.map(bridge => bridge.initialize(HUE_DEVICE_TYPE)));

        }).then(bridges => {
          let lights = 0;

          // Get the number of lights available for each of the bridges.
          this.bridges_.forEach(bridge => lights += bridge.getLightCount());

          // Output to the console that the Hue service has been initialized successfully.
          Log.info('Hue: found ' + bridges.length + ' bridges and ' + lights + ' lights.');
        });

    // Throw an error in case initialization went wrong at any phase.
    this.initialize_promise_.catch(error => {
      Log.error('Hue: Unable to initialize. (' + error + ')');
    })
  }

  // Returns a promise that will be resolved with the IP addresses of the local bridges when
  // available. The Philips Hue UPnP API will be used for determining this.
  findBridges() {
    return new Promise((resolve, reject) => {
      request(HUE_PHILIPS_UPNP_API, (error, response, body) => {
        if (error)
          return reject(error);

        if (response.statusCode != 200)
          return reject('Hue: Unexpected response from server: ' + response.statusMessage);

        resolve(JSON.parse(body));
      });
    });
  }

  // Returns a promise that will be resolved with zero or more HueBridge objects when the service
  // has finished initializing and the available bridges are known.
  getBridges() {
    return this.initialize_promise_.then(() => this.bridges_);
  }

  // Returns a promise that will be resolved with zero or more HueLight objects when the service
  // has finished initializing and the available lights are known.
  getLights() {
    return this.initialize_promise_.then(() => {
      let lights = [];

      this.bridges_.forEach(bridge => {
        lights.push(...bridge.getLights());
      });

      return lights;
    })
  }
};
