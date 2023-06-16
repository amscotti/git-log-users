#!/usr/bin/env node

import { program } from 'commander'
import { getGitLogs } from '../src/logic.js'

program.version('2.0.1').description('Get Users based on git logs')

program
  .command('get <path>')
  .alias('g')
  .description('Get the Users for a give repo path')
  .action(getGitLogs)

program.parse(process.argv)
