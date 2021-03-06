/*
  Copyright Jesús Pérez <jesusprubio@gmail.com>
            Sergio Garcia <s3rgio.gr gmail com>

  This code may only be used under the GPLv3 license found at
  http://www.gnu.org/licenses/gpl-3.0.txt.
*/

'use strict';

// http://ci.marcelog.name:8080/view/NodeJS/job/Nami/javadoc/index.html
const Nami = require('nami').Nami;

const utils = require('../utils');

const Promise = utils.Promise;
const dbg = utils.dbg(__filename);


function getPromise(rhost, credPair, action, opts) {
  return new Promise((resolve, reject) => {
    const result = { up: false, authed: false };
    const cliOpts = {
      host: rhost,
      port: opts.rport || 5038,
    };
    if (credPair) {
      if (credPair[0]) { cliOpts.username = credPair[0]; }
      if (credPair[1]) { cliOpts.secret = credPair[1]; }
    }

    const client = new Nami(cliOpts);

    // It's no working:
    // https://github.com/marcelog/Nami/pull/10#issuecomment-22828220
    // client.logger.setLevel('WARN');
    client.logLevel = 0;


    client.on('namiConnectionError', event => reject(event.error));

    client.on('welcome', (data) => {
      result.data = data.msg;
      dbg('Welcome msg received:', data);
    });

    client.on('namiConnected', () => {
      dbg('Connected');
      result.up = true;
      result.authed = true;
      if (!action) {
        dbg('Done, without action');
        resolve(result);
        client.close();
        return;
      }

      // TODO: No error first pattern for the cb? Check for errors here.
      dbg('Sending the action ...');
      client.send(action, (res) => {
        dbg('Action sent correctly');
        client.close();
        // Each action can have different format, so we return the full object.
        resolve(res.lines);
      });
    });

    client.on('namiLoginIncorrect', () => {
      dbg('Auth enabled');
      result.up = true;
      // For an action (post-explotation) it's expected we already have
      // a valid credentials.
      if (!action) {
        resolve(result);
      } else {
        reject(new Error('Invalid credentials'));
      }
      client.close();
    });

    client.open();
  });
}


module.exports.map = (rhost, opts = {}) => getPromise(rhost, null, null, opts);


module.exports.brute = (rhost, credPair, opts = {}) => getPromise(rhost, credPair, null, opts);


// ie: action = new namiLib.Actions.ListCommands();
module.exports.post =
  (rhost, credPair, action, opts = {}) => getPromise(rhost, credPair, action, opts);
