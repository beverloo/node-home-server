// Copyright 2015 Peter Beverloo. All rights reserved.
// Use of this source code is governed by the MIT license, a copy of which can
// be found in the LICENSE file.

import Log from './log';
import fs from 'fs';

// Filename (in the CWD) where the data store will reside.
const FILENAME = 'state.json';

// Very simple persistent key-value storage. All operations are asynchronous.
//
// This storage is backed by a JSON file on disk. No authentication of the stored data will be done
// when reading from the file. All stored values must be serializable to JSON.
class Storage {
  constructor() {
    this.data_ = null;
    this.load_promise_ = null;
    this.write_promise_ = Promise.resolve();
  }

  // Returns whether |key| exists in the data store.
  has(key) {
    return this.load().then(() => {
      return this.data_.hasOwnProperty(key);
    });
  }

  // Returns the value associated with |key| in the data store, or NULL if it does not exist.
  get(key) {
    return this.load().then(() => {
      if (!this.data_.hasOwnProperty(key))
        return null;

      return this.data_[key];
    });
  }

  // Updates the value associated with |key| to |value|. Settles when the data has been stored.
  set(key, value) {
    return this.load().then(() => {
      this.data_[key] = value;
      return this.save();
    });
  }

  // Removes the data associated with |key|. Settles when the data has been stored.
  remove(key) {
    return this.load().then(() => {
      if (!this.data_.hasOwnProperty(key))
        return true;

      delete this.data_[key];
      return this.save();
    });
  }

  // Reads the database from disk.
  load() {
    if (this.load_promise_)
      return this.load_promise_;

    this.load_promise_ = new Promise(resolve => {
      fs.readFile(FILENAME, (error, data) => {
        this.data_ = {};

        if (error) {
          Log.error('Unable to open the storage file: ' + error);

          resolve();
          return;
        }

        try {
          this.data_ = JSON.parse(data);
        } catch (e) {
          Log.error('Unable to parse the storage file: ' + e);
        }

        resolve();
      });
    });

    return this.load_promise_;
  }

  // Stores the current data store values to disk.
  save() {
    let data = JSON.stringify(this.data_);
    this.write_promise_ =
        this.write_promise_.then(() => {
          return new Promise(resolve => {
            fs.writeFile(FILENAME, data, (error) => {
              if (error)
                Log.error('Unable to write the storage file: ' + error);

              console.log('Wrote the file. (' + data + ')');
              resolve();
            });
          });
        });

    return this.write_promise_;
  }
};
