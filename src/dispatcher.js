// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

export default class Dispatcher {
  constructor() {
    this.routes_ = [];
  }

  addRoute(route, handler) {
    this.routes_[route] = handler;
  }

  dispatch(request, response) {
    return new Promise((resolve, reject) => {
      if (!(request.url in this.routes_))
        return reject('No applicable route has been registered.');

      let handler = this.routes_[request.url];
      resolve(handler(request, response));
    });
  }
};