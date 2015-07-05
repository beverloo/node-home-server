// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

//
export default class HueLight {
  constructor(details, bridge) {
    this.bridge_ = bridge;
    this.color_ = {
      bri: details.state.bri,
      hue: details.state.hue,
      sat: details.state.sat
    };

    this.id_ = details.uniqueid;
    this.name_ = details.name;
    this.power_ = details.state.on;
  }

  // Returns the color tri-state color object of the light.
  getColor() { return this.color_; }

  // Returns the unique id for the light represented by this object.
  getId() { return this.id_; }

  // Returns the name (which may be changed by the owner) of the light.
  getName() { return this.name_; }

  // Returns whether the light is currently turned on.
  hasPower() { return this.power_; }

};
