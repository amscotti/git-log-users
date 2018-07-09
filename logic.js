const simpleGit = require('simple-git')
require('console.table')

const GroupCommitByKey = (commits, key) => {
  const commitsByKey = new Map()
  commits.forEach((commit) => {
    if (!commitsByKey.has(commit[key])) commitsByKey.set(commit[key], [])
    commitsByKey.get(commit[key]).push(new Date(commit.date))
  })
  return commitsByKey
}

const formatUserDetails = (users, formatDateFunction) => {
  const usersDetail = []
  users.forEach((val, key) => {
    const dateArray = val.sort((a, b) => a - b)
    usersDetail.push({
      user: key,
      commits: dateArray.length,
      first_commit: dateArray[0],
      last_commit: dateArray[dateArray.length - 1]
    })
  })

  return usersDetail
  // Sort by first commit date
    .sort((a, b) => a.first_commit - b.first_commit)
  // Format dates to Strings for output
    .map(u => {
      u.first_commit = formatDateFunction(u.first_commit)
      u.last_commit = formatDateFunction(u.last_commit)
      return u
    })
}

const readLogs = (logs) => {
  // Group by User email with array of commit dates
  const commitsByEmail = GroupCommitByKey(logs.all, 'author_email')

  // Create array with user details
  const usersDetail = formatUserDetails(commitsByEmail, d => d.toISOString().slice(0, 10))

  // Print out details into a table
  console.table(`${usersDetail.length} user details for ${logs.total} commits`, usersDetail)
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
