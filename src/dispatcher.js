// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Log from './log';

// Constants for identifying the kind of request a request handler is able to deal with. The API
// follows a RESTful 
export const GET = 1;
export const PUT = 2;
export const POST = 3;
export const DELETE = 4;

// Converts the request method used for |request| to the internal representation.
function requestMethodForRequest(request) {
  switch (request.method) {
    case 'GET':    return GET;
    case 'PUT':    return PUT;
    case 'POST':   return POST;
    case 'DELETE': return DELETE;
  }

  Log.warning('Invalid request type for request (' + request.method + '): ' + request);
  return GET;
}

// 
export default class Dispatcher {
  constructor() {
    this.routes_ = {};
  }

  addRoute(method, route, handler) {
    if (!this.routes_.hasOwnProperty(method))
      this.routes_[method] = [];

    this.routes_[method].push({
      handler,
      match: new RegExp(route.replace(/:[^\s/]+/g, '([^/\\?]+)'))
    });
  }

  dispatch(request, response) {
    return new Promise((resolve, reject) => {
      let method = requestMethodForRequest(request);
      if (this.routes_.hasOwnProperty(method)) {
        for (let route of this.routes_[method]) {
          let params = route.match.exec(request.url);
          if (params === null)
            continue;

          resolve(route.handler(request, response, ...params.slice(1)));
          return;
        }
      }

      throw new Error('No applicable routes are available');
    });
  }
};