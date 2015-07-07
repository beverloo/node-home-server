// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

//
export default class HueLight {
  constructor(details, index, bridge) {
    this.bridge_ = bridge;
    this.color_ = {
      brightness: details.state.bri,
      hue: details.state.hue,
      saturation: details.state.sat
    };

    this.id_ = details.uniqueid;
    this.index_ = index;
    this.name_ = details.name;
    this.power_ = details.state.on;
    this.effect_ = details.state.effect;
    this.alert_ = details.state.alert;
  }

  // Returns the color tri-state color object of the light.
  getColor() { return this.color_; }

  // Returns the unique id for the light represented by this object.
  getId() { return this.id_; }

  // Returns the index of the light represented by this object. Must be used when updating the
  // state or information of this light through the API.
  getIndex() { return this.index_; }

  // Returns the name (which may be changed by the owner) of the light.
  getName() { return this.name_; }

  // Returns whether the light is currently turned on.
  hasPower() { return this.power_; }

  // Returns the effect that's currently applying to the light.
  getEffect() { return this.effect_; }

  // Returns the alert status that's currently applying to the light.
  getAlert() { return this.alert_; }

};
