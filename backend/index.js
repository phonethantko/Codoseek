const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const port = process.env.PORT || 5000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let username
let repos = []
let lang = []

let repoOptions = {
  url: `https://api.github.com/users/${username}/repos?access_token=cd997d78bfd0f4c8c29385b0c137d45661b35f40`,
  headers: {
    'User-Agent': 'phonethantko'
  }
}

request.get(repoOptions, (error, response, body) => {
  // parseRepos(JSON.parse(body))
  let tempRepos = JSON.parse(body)
  for(let i = 0; i < tempRepos.length; i++) {
    repos.push(tempRepos[i].name)
  }
})


// Call github apis
function iterateRepo() {
  for(let i = 0; i < repos.length; i++){
    let options = {
      url: `https://api.github.com/repos/${username}/${repos[i]}/languages?access_token=cd997d78bfd0f4c8c29385b0c137d45661b35f40`,
      headers: {
        'User-Agent': 'phonethantko'
      }
    }
    request.get(options, (error, response, body) => {
      lang.push(JSON.parse(body))
    })
  }
}

app.get('/', (req, res) => {
  res.send('API is working')
})

app.post('/', (req, res) => {
  username = req.body.username
  console.log('Connection using username' + username)
})

app.get('/api/lang', (req, res) => {
  iterateRepo()
  res.send(lang)
})

app.get('/api/repos', (req, res) => {
  res.send(repos)
})

app.listen(port, () => console.log(`Listening on port ${port}`))
