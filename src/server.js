// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Dispatcher from './dispatcher';
import Log from './log';
import ModuleManager from './module_manager';
import config from './config';
import http from 'http';

// Import the modules that have to load as part of the server.
import Hue from './modules/hue';

class Server {
  constructor() {
    this.dispatcher_ = new Dispatcher();
    this.module_manager_ = new ModuleManager();

    this.server_ = http.createServer(::this.onRequest);
    this.server_.listen(config.PORT, ::this.onStart);
  }

  // Called when the HTTP server has successfully started, and is listening for incoming requests.
  // Load all required modules at this time.
  onStart() {
    Log.info('The server is now listening on port ' + config.PORT);
    this.module_manager_.initialize({
      env: {
        dispatcher: this.dispatcher_,
        module_manager: this.module_manager_
      },
      modules: {
        'hue': Hue
      }
    });
  }

  // Called when a request has been made to the HTTP server. 
  onRequest(request, response) {
    Log.info('Incoming request from ' + request.connection.remoteAddress + ': ' + request.url);

    // TODO(peter): Implement support for simple password-based authentication.

    this.dispatcher_.dispatch(request, response).catch(error => {
      response.end(JSON.stringify({ error: error.message }));
    });
  }
};

new Server();
