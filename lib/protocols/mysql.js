/*
  Copyright Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the GPLv3 license found at
  http://www.gnu.org/licenses/gpl-3.0.txt.
*/

'use strict';

const mysql = require('mysql');

const utils = require('../utils');

const Promise = utils.Promise;
const dbg = utils.dbg(__filename);


module.exports.brute = (rhost, credPair, opts = {}) =>
  new Promise((resolve, reject) => {
    const result = { up: false, authed: false };
    const cliOpts = {
      host: rhost,
      port: opts.rport || 3306,
      connectTimeout: opts.timeout,
      // Just in case
      // TODO: This will be resulting -> brute: Server does not support secure connection.
      // But we need to figure out someway to add this when it uses SSL to avoid an error if the certificate is not good.
      //ssl: { rejectUnauthorized: false },
    };

    if (credPair) {
      cliOpts.user = credPair[0];
      cliOpts.password = credPair[1];
    }

    const client = mysql.createConnection(cliOpts);
    dbg('Client setup:', cliOpts);

    client.connect((err) => {
      client.destroy();
      if (err) {
        // Expected result so we don't want to stop the loop.
        if (/ER_ACCESS_DENIED_ERROR/.test(err)) {
          dbg('NOT valid', credPair);

          result.up = true;
          resolve(result);
        } else {
          reject(err);
        }

        return;
      }

      dbg('Valid', credPair);
      result.up = true;
      result.authed = true;
      resolve(result);
    });
  });
