const simpleGit = require('simple-git')
const { max, min } = require('lodash')
const { reduce, sortBy, flow } = require('lodash/fp')
const map = require('lodash/fp/map').convert({cap: false})
require('console.table')

const formatUserDetails = (commits, key, formatDate) => {
  return flow(
    // Group By `key`
    reduce((result, value) => {
      (result[value[key]] || (result[value[key]] = [])).push(new Date(value.date))
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
    map(u => {
      u.first_commit = formatDate(u.first_commit)
      u.last_commit = formatDate(u.last_commit)
      return u
    })
  )(commits)
}

const readLogs = (logs) => {

  const groupByKey = 'author_email'
  const formatDate = date => date.toISOString().slice(0, 10)

  // Format data for printing out
  const users = formatUserDetails(logs.all, groupByKey, formatDate)

  // Print out details into a table
  console.table(`${users.length} user details for ${logs.total} commits`, users)
}

const getGitLogs = (gitRepo) => {
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
