/*
  Copyright Jesús Pérez <jesusprubio@gmail.com>

  This code may only be used under the GPLv3 license found at
  http://www.gnu.org/licenses/gpl-3.0.txt.
*/

'use strict';

const clc = require('cli-color');
const prettyjson = require('prettyjson');
const emoji = require('node-emoji');


/* eslint-disable no-console */
module.exports.regular = str => console.log(str);

module.exports.info = str => console.log(clc.xterm(55)(str));

module.exports.infoHigh = str => console.log(clc.xterm(63)(str));

module.exports.result = str => console.log(clc.xterm(46)(str));

module.exports.json = json => console.log(prettyjson.render(json));

module.exports.error = str => console.log(clc.red(str));

// module.exports.clear = () => process.stdout.write(clc.reset());

module.exports.title = str => console.log(clc.bold.xterm(202)(str));

module.exports.subtitle = str => console.log(clc.bold(str));

module.exports.time = label => console.time(clc.xterm(63)(label));

module.exports.timeEnd = label => console.timeEnd(clc.xterm(63)(label));
/* eslint-enable no-console */

module.exports.emoji = label => emoji.get(label);

