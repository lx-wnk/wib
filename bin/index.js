#!/usr/bin/env node
'use strict';

const {version} = require('../package.json');
const { Command } = require('commander');
const note = require('../src/commands/note');
const track = require('../src/commands/track');

const program = new Command();

program.version(`v${version}`, '-v, --vers', 'output the current version');
program.addCommand(note.commandSetup());
program.addCommand(track.commandSetup());

program.parse(process.argv);
