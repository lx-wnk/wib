#!/usr/bin/env node
'use strict';

const {version}      = require('../package.json'),
    {Command}      = require('commander'),
    pathToCommands = '../src/commands/',
    program = new Command();

program.version(`v${version}`, '-v, --vers', 'output the current version');

require("fs").readdirSync(require('path').join(__dirname, pathToCommands)).forEach(function (command) {
    program.addCommand(require(pathToCommands + command).commandSetup())
});

program.parse(process.argv);
