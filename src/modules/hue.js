// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import { Module, GET, route } from '../module';

export default class Hue extends Module {
  constructor(env) {
    super(env);
  }

  @route(GET, '/hue')
  onRequest(request, response) {
    response.end('Hi, this is Hue!');
  }
};
