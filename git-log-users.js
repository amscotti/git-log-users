#!/usr/bin/env node

const program = require('commander')
const { getGitLogs } = require('./logic')

program
  .version('1.0.0')
  .description('Get Users based on git logs')

program
  .command('get <path>')
  .alias('g')
  .description('Get the Users for a give repo path')
  .action((path) => getGitLogs(path))

program.parse(process.argv)
