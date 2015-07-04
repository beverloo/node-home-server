// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

export default class Hue {
  constructor(env) {
    this.env_ = env;
    this.env_.dispatcher.addRoute('/hue', ::this.onRequest);
  }

  onRequest(request, response) {
    response.end('Hi, this is Hue!');
  }
};
