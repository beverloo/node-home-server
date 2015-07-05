// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

// Constants for identifying the kind of request a request handler is able to deal with. The API
// follows a RESTful 
export const GET = 1;
export const PUT = 2;
export const POST = 3;
export const DELETE = 4;

export default class Dispatcher {
  constructor() {
    this.routes_ = [];
  }

  addRoute(method, route, handler) {
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