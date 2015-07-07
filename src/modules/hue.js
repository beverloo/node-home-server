// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { GET, PUT } from '../dispatcher';
import { Module, route } from '../module';

import HueService from './hue/hue_service';

// Implements a set of convenient APIs for working 
//
// The following methods are supported in the Hue API:
//
// GET:
//     /hue/lights      - Gets a list of all connected lights.
//
// PUT:
//     /hue/:id/color   - Updates the color (brighness, hue and saturation) of the given light.
//     /hue/:id/power   - Toggles the given light on or off.
//
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
  //     'effect'  Dynamic effect applying to the light. Will be one of [none, colorloop].
  //     'alert'   Temporary effect applying to the light. Will be one of [none, select].
  //
  // The list of lights will usually be returned immediately, but this does mean that the returned
  // data may be slightly outdated at times.
  @route(GET, '/hue/lights')
  onGetLights(request, response) {
    this.service_.getLights().then(lights => {
      let processed_lights = [];

      lights.forEach(light => {
        processed_lights.push({
          id: light.getId(),
          name: light.getName(),
          power: light.hasPower(),
          color: light.getColor(),
          effect: light.getEffect(),
          alert: light.getAlert()
        });
      });

      response.end(JSON.stringify(processed_lights));
    });
  }

  // API: /hue/light/:id (GET)
  //
  // Returns all information about the given light. The following fields will be returned:
  //
  //     'id'      Unique id of the light. Must be used when issuing commands for this light.
  //     'name'    Name of the light. Can be updated through many Philips Hue apps.
  //     'power'   Whether the light currently has power. (I.e. is turned on.)
  //     'color'   The tri-state (brightness, hue and saturation) color of the light.
  //     'effect'  Dynamic effect applying to the light. Will be one of [none, colorloop].
  //     'alert'   Temporary effect applying to the light. Will be one of [none, select].
  //
  // Possible errors include an invalid light id and errors when communicating with the bridge.
  @route(GET, '/hue/light/:id')
  onGetLightInfo(request, response, light_id) {
    this.service_.getLightById(light_id).then(light => {
      if (!light)
        throw new Error('Invalid light supplied.');

      response.end(JSON.stringify({
        id: light.getId(),
        name: light.getName(),
        power: light.hasPower(),
        color: light.getColor(),
        effect: light.getEffect(),
        alert: light.getAlert()
      }));
    });
  }

  // API: /hue/light/:id (PUT)
  //
  // Updates the status of the given light. At least one of the following arguments must be given.
  //
  //     'power'   Whether the light currently has power. (I.e. is turned on.)
  //     'color'   The tri-state (brightness, hue and saturation) color of the light.
  //     'effect'  Dynamic effect applying to the light. Will be one of [none, colorloop].
  //     'alert'   Temporary effect applying to the light. Will be one of [none, select].
  //
  // The request will end when the light's status has been updated successfully. Possible errors
  // include an invalid light id, and errors when communicating with the bridge.
  @route(PUT, '/hue/light/:id')
  onPutLightInfo(request, response, light_id) {
    throw new Error('This method has not been implemented yet.');
  }

};
