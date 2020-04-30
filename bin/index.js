#!/usr/bin/env node
'use strict';

const {version} = require('../package.json');
const {Command} = require('commander');
const breakCommand = require('../src/commands/break');
const list = require('../src/commands/list');
const note = require('../src/commands/note');
const start = require('../src/commands/start');
const stop = require('../src/commands/stop');
const track = require('../src/commands/track');

const program = new Command();

program.version(`v${version}`, '-v, --vers', 'output the current version');
program.addCommand(breakCommand.commandSetup());
program.addCommand(list.commandSetup());
program.addCommand(note.commandSetup());
program.addCommand(start.commandSetup());
program.addCommand(stop.commandSetup());
program.addCommand(track.commandSetup());

program.parse(process.argv);
