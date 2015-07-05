// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { GET, POST } from '../dispatcher';
import { Module, route } from '../module';

import HueService from './hue/hue_service';

export default class Hue extends Module {
  constructor(env) {
    super(env);

    this.service_ = new HueService();
    this.service_.initialize();
  }

  // API: /hue/lights (GET)
  //
  // Returns a list of all Hue lights available on the local bridges. Each of the lights has the
  // following keys provided:
  //
  //     'id'      Unique id of the light. Must be used when issuing commands for this light.
  //     'name'    Name of the light. Can be updated through many Philips Hue apps.
  //     'power'   Whether the light currently has power. (I.e. is turned on.)
  //     'color'   The tri-state (brightness, hue and saturation) color of the light.
  //
  // The list of lights will usually be returned immediately, but this does mean that the returned
  // data may be slightly outdated at times.
  @route(GET, '/hue/lights')
  onRequest(request, response) {
    this.service_.getLights().then(lights => {
      let processed_lights = [];

      lights.forEach(light => {
        processed_lights.push({
          id: light.getId(),
          name: light.getName(),
          power: light.hasPower(),
          color: light.getColor()
        });
      });

      response.end(JSON.stringify(processed_lights));
    });
  }
};
