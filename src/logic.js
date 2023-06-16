import simpleGit from 'simple-git'
import Table from 'cli-table3'

const table = new Table({
  head: ['User', 'Number of Commits', 'First Commit', 'Last Commit']
})

// Formats a Date object into a human-readable string
const formatDate = (date) => date.toISOString().slice(0, 10)

// Groups commits by a given key and calculates user statistics
const formatUserDetails = (commits, key) => {
  const grouped = commits.reduce((result, value) => {
    const keyValue = value[key]
    const current = result[keyValue] || []
    result[keyValue] = [...current, new Date(value.date)]
    return result
  }, {})

  const userDetails = Object.entries(grouped)
    .map(([index, value]) => {
      let minDate = value[0]
      let maxDate = value[0]

      for (const date of value) {
        if (date < minDate) {
          minDate = date
        }
        if (date > maxDate) {
          maxDate = date
        }
      }

      return {
        user: index,
        commits: value.length,
        first_commit: minDate,
        last_commit: maxDate
      }
    })
    .sort((a, b) => a.first_commit.getTime() - b.first_commit.getTime())

  return userDetails.map((user) => ({
    ...user,
    first_commit: formatDate(user.first_commit),
    last_commit: formatDate(user.last_commit)
  }))
}

// Displays commit statistics in a readable format
const readLogs = (logs) => {
  const groupByKey = 'author_email'

  const users = formatUserDetails(logs.all, groupByKey)

  const title = `\n${users.length} user details for ${
    logs.total
  } commits, from ${users[0].first_commit} to ${
    users[users.length - 1].last_commit
  }.`

  console.log(title)
  table.push(...users.map(Object.values))

  console.log(table.toString())
}

// Fetches commit logs and processes them
export const getGitLogs = (gitRepo) => {
  const git = simpleGit(gitRepo)
  git.log((err, result) => {
    if (err) {
      console.log(`Unable to read git repo from ${gitRepo}`)
      return
    }
    readLogs(result)
  })
}
