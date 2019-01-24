const simpleGit = require('simple-git')
const { get, set, max, min, first, last } = require('lodash')
const { reduce, sortBy, flow } = require('lodash/fp')
const map = require('lodash/fp/map').convert({cap: false})
require('console.table')

const update = (key, fn) => o => set(o, key, fn(get(o, key)))

const formatUserDetails = (commits, key, formatDate) => {
  return flow(
    // Group By `key`
    reduce((result, value) => {
      result[value[key]] = [...(result[value[key]] || []), new Date(value.date)]
      return result
    }, {}),
    // Map over items, and create format for ouput
    map((value, index) => {
      return {
        user: index,
        commits: value.length,
        first_commit: min(value),
        last_commit: max(value)
      }
    }),
    // Sort by first_commit date
    sortBy(['first_commit']),
    // Format dates using the formatDate Function
    map(update('first_commit', formatDate)),
    map(update('last_commit', formatDate))
  )(commits)
}

const readLogs = logs => {
  const groupByKey = 'author_email'
  const formatDate = date => date.toISOString().slice(0, 10)

  // Format data for printing out
  const users = formatUserDetails(logs.all, groupByKey, formatDate)

  // Print out details into a table
  const title = `${users.length} user details for ${logs.total} commits, from ${first(users).first_commit} to ${last(users).last_commit}.`
  console.table(title, users)
}

const getGitLogs = gitRepo => {
  const git = simpleGit(gitRepo)
  git.log((err, result) => {
    if (err) {
      console.log(`Unable to read git repo from ${gitRepo}`)
      return
    }
    readLogs(result)
  })
}

module.exports = { getGitLogs }
