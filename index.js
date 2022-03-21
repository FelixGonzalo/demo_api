require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const app = express()
const Post = require('./models/Post')
const notFound = require('./middleware/notFound')
const handleError = require('./middleware/handleError')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

app.get('/api/posts', (request, response) => {
  Post.find({}).then(posts => {
    response.json(posts)
  })
})

app.get('/api/posts/:id', (request, response, next) => {
  const { id } = request.params
  Post.findById(id)
    .then(post => {
      if (post) {
        return response.json(post)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => {
      next(err)
    })
})

app.put('/api/posts/:id', (request, response, next) => {
  const { id } = request.params
  const post = request.body

  const newPostInfo = {
    title: post.title,
    body: post.body,
  }

  Post.findByIdAndUpdate(id, newPostInfo, { new: true }).then(result => {
    response.json(result)
  })
})

app.delete('/api/posts/:id', (request, response, next) => {
  const { id } = request.params
  Post.findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/posts', (request, response) => {
  const post = request.body

  if (!post || !post.title || !post.body) {
    return response.status(400).json({
      error: 'post.title or post.body is missing',
    })
  }

  const ids = posts.map(post => post.id)
  const maxId = Math.max(...ids)

  const newPost = new Post({
    userId: 1,
    id: maxId + 1,
    title: post.title,
    body: post.body,
    date: new Date().toISOString(),
  })

  newPost.save().then(savedPost => {
    response.status(200).json(savedPost)
  })
})

app.use(notFound)

app.use(handleError)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})