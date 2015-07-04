// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import config from './config';
import http from 'http';
import Log from './log';

class Server {
  constructor() {
    this.server_ = http.createServer(::this.onRequest);
    this.server_.listen(config.PORT, ::this.onStart);
  }

  onStart() {
    Log.info('The server is now listening on port ' + config.PORT);
  }

  onRequest(request, response) {
    Log.info('Incoming request from ' + request.connection.remoteAddress + ': ' + request.url);
    response.end('Path: ' + request.url);
  }
};

new Server();