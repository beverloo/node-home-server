// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Log from './log';

// The module manager maintains the individual modules available within the home server, and allows
// them to access each other by requesting the instance.
export default class ModuleManager {
  constructor() {
    this.env_ = {};
    this.modules_ = {};
  }

  // Initializes the module manager with |options|.
  //
  // |options.env| is a map with the global environment exposed to all the modules.
  //
  // |options.modules| is an array with the names of all modules that will be loaded during
  // this initialization step. Each name will be require()'d.
  initialize(options) {
    if (options.hasOwnProperty('env'))
      this.env_ = options.env;

    if (!options.hasOwnProperty('modules')) {
      Log.error('No modules have been specified to be loaded.');
      return;
    }

    // Initialize all the modules, storing them in |this.modules_| for later access.
    Object.keys(options.modules).forEach(module => {
      Log.info('Loading module "' + module + '"...');
      this.modules_[module] = new options.modules[module](this.env_);
    });

    Log.info('Successfully loaded ' + Object.keys(this.modules_).length + ' modules.');
  }
};
