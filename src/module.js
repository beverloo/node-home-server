// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

// Base class for a module. Stores the environment and handles magic such as route annotations.
export class Module {
  constructor(env) {
    this.env_ = env;

    let decoratedRoutes = Object.getPrototypeOf(this).decoratedRoutes_;
    if (!decoratedRoutes)
      return;

    decoratedRoutes.forEach(route => {
      env.dispatcher.addRoute(route.method, route.route_path, ::this[route.handler]);
    });
  }
};

// Annotation that can be used on modules to indicate that the annotated method is the request
// handler for a |method| (GET, POST) request for |route_path|.
export function route(method, route_path) {
  return (target, handler) => {
    if (!target.hasOwnProperty('decoratedRoutes_'))
      target.decoratedRoutes_ = [];

    target.decoratedRoutes_.push({ method, route_path, handler });
  };
}
