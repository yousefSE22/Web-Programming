const url = 'http://localhost:3000'
const fetcher = {}
export default fetcher

fetcher.getProjects = async () => {
  try {
    const projects = await fetch(`${url}/get/projects`)
    const projectsJson = await projects.json()
    return projectsJson
  } catch (error) {
    console.error('There was an error with fetching the projects', error)
  }
}

fetcher.getProject = async (projectId) => {
  const project = await fetch(`${url}/get/projects/${projectId}`)
  const projectjson = await project.json()
  return projectjson
}

fetcher.getIssue = async (issueId) => {
  const issue = await fetch(`${url}/get/issue/${issueId}`)
  const issueJson = await issue.json()
  return issueJson
}

fetcher.getIssues = async (projectId) => {
  const issues = await fetch(`${url}/get/issues/${projectId}`)
  const issuesJson = await issues.json()
  return issuesJson
}
