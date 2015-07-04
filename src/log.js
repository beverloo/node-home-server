// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import color from 'bash-color';

export default class Log {
  static info(message) {
    console.log('[' + color.cyan('INFO') + '] ' + message);
  }

  static warning(message) {
    console.log('[' + color.yellow('WARN') + '] ' + message);
  }

  static error(message) {
    console.log('[' + color.red('ERROR') + '] ' + message);
  }
};
