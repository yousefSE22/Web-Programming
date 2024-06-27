import fetcher from './fetching.mjs'
const main = {}

// Function to create the home page
main.createHome = async (showMain = false) => {
  main.clearBody()
  if (showMain) {
    document.body.insertBefore(main.createHeader(), document.body.firstChild)
  }
  main.createStartDiv()
}

main.createStartDiv = async () => {
  const h1 = document.createElement('h1')
  h1.innerHTML = 'Welcome!'
  document.getElementById('main').appendChild(h1)
}

// Function creates header for website
main.createHeader = () => {
  const head = document.createElement('header')
  head.className = 'header'

  const nav = main.createNavbar()
  head.appendChild(nav)

  // Create the flash message
  const flash = document.createElement('div')
  flash.id = 'flashMessage'
  flash.className = 'flashMessage'
  flash.innerHTML = ''
  flash.style.display = 'none'

  const div = document.createElement('div')
  div.id = 'topDiv'
  div.className = 'topDiv'
  div.appendChild(head)
  div.appendChild(flash)

  return div
}

// Function for creating navabr
main.createNavbar = () => {
  const nav = document.createElement('nav')
  nav.className = 'navbar'
  const home = document.createElement('a')
  home.className = 'home'
  home.innerHTML = 'Home'
  home.onclick = () => {
    main.createHome()
    window.history.pushState({}, '', '/home')
  }
  nav.appendChild(home)

  const projects = document.createElement('a')
  projects.className = 'projects'
  projects.innerHTML = 'Projects'

  projects.onclick = () => {
    window.history.pushState({}, '', '/get/projects')
    main.createProjectsPage()
  }
  nav.appendChild(projects)
  return nav
}
// function to create the page for projects list
main.createProjectsPage = async () => {
  main.clearBody()
  const projects = await fetcher.getProjects()
  projects.sort((a, b) => {
    return new Date(b.updated_at).toLocaleString().localeCompare(new Date(a.updated_at).toLocaleString())
  })

  const projectsDiv = document.createElement('div')
  projectsDiv.className = 'projectsDiv'

  for (let i = 0; i < projects.length; i++) {
    projectsDiv.appendChild(main.createProjects(projects[i]))
  }
  document.getElementById('main').appendChild(projectsDiv)
}
// function to create the project element
main.createProjects = (project) => {
  const mainDiv = document.createElement('div')
  mainDiv.className = 'mainDiv'

  const projectDiv = document.createElement('div')
  projectDiv.className = 'projectDiv'
  projectDiv.id = project.id

  const projectName = document.createElement('h2')
  projectName.className = 'projectName'
  projectName.innerHTML = project.name
  projectDiv.appendChild(projectName)

  const latestActivity = document.createElement('p')
  latestActivity.className = 'latestActivity'
  const latestActivityDate = new Date(project.last_activity_at)
  const latestActivitySTR = latestActivityDate.toDateString()
  const latestActivityTimeSTR = latestActivityDate.toLocaleTimeString()
  latestActivity.innerHTML = `Latest activity was at: ${latestActivitySTR} ${latestActivityTimeSTR}`
  projectDiv.appendChild(latestActivity)
  mainDiv.appendChild(projectDiv)

  const buttonDiv = document.createElement('div')
  buttonDiv.className = 'btnDiv'
  const btn = document.createElement('button')
  btn.className = 'btn'
  btn.innerHTML = 'Enter'
  buttonDiv.appendChild(btn)
  mainDiv.appendChild(buttonDiv)
  buttonDiv.addEventListener('click', () => {
    window.history.pushState({}, '', '/projects/' + project.id + '/issues')
    main.createProjectDiv(project.id)
  })
  return mainDiv
}

main.createProjectDiv = async (id) => {
  main.clearBody()
  const project = await fetcher.getProject(id)
  const issues = await fetcher.getIssues(id)
  issues.sort((a, b) => {
    return new Date(b.updated_at).toLocaleString().localeCompare(new Date(a.updated_at).toLocaleString())
  })
  document.getElementById('main').appendChild(main.createIssuesDiv(project, issues))
}

main.createIssuesDiv = (project, issues) => {
  const {
    name,
    description
  } = project

  const createHTMLElement = (tag, classNames = [], innerHTML = '') => {
    const element = document.createElement(tag)
    element.className = classNames.join(' ')
    element.innerHTML = innerHTML
    return element
  }

  const issueDiv = createHTMLElement('div', ['issueDiv'])
  issueDiv.innerHTML = `
      <h2 class="projectName">${name}</h2>
      <p class="projectDescription">${description || 'Description not provided for this project'}</p>
    `

  if (issues.length === 0) {
    const issuesDontExist = createHTMLElement('p', ['issues'], 'No issues exist for this project')
    issueDiv.appendChild(issuesDontExist)
    return issueDiv
  }
  const issuesDiv = createHTMLElement('div', ['issuesDiv'])
  issues.forEach((issue) => {
    const issueElement = main.createIssueDiv(issue)
    issuesDiv.appendChild(issueElement)
  })

  issueDiv.appendChild(issuesDiv)

  return issueDiv
}

main.createIssueDiv = (issue) => {
  console.log(issue)
  // eslint-disable-next-line camelcase
  const { id, title, state, description, created_at, updated_at } = issue
  const createElement = (tag, classNames = [], textContent = '') => {
    const element = document.createElement(tag)
    element.classList.add(...classNames)
    element.textContent = textContent
    return element
  }
  const issueDiv = createElement('div', ['issueDiv', id])
  issueDiv.innerHTML = `
      <div class="issueTop">
        <h3 class="issueTitle">Issue Name: ${title}</h3>
        <p class="issueState">State: ${state} 
      </div>
      <p class="issueDescription">${description ? `Description: ${description}` : 'There is not any description in this issue'}</p>
      <p class="issueCreatedAt">Created at: ${new Date(created_at).toDateString()} ${new Date(created_at).toLocaleTimeString()}</p>
      <p class="issueUpdatedAt">Updated at: ${new Date(updated_at).toDateString()} ${new Date(updated_at).toLocaleTimeString()}</p>
    `
  return issueDiv
}

// Function to clear the page
main.clearBody = async () => {
  document.getElementById('main').innerHTML = ''
}

export default main
