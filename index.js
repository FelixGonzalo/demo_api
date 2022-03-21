require('dotenv').config()
require('./mongo')
const express = require('express')
const cors = require('cors')
const app = express()
const Post = require('./models/Post')

//libre
app.use(cors())
//this is a middleware: con use pasan todos los tipos: get, post, etc.
app.use(express.json())

let posts = []

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

app.get('/api/posts', (request, response) => {
  Post.find({}).then(posts => {
    response.json(posts)
  })
})

app.get('/api/posts/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  // const post = posts.find(post => post.id === id)
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
      // console.log(err)
      // response.status(400).end()
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
  // const id = Number(request.params.id)
  // posts = posts.filter(post => post.id !== id)

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

  // posts = [...posts, newPost]
  // response.status(200).json(newPost)

  newPost.save().then(savedPost => {
    response.status(200).json(savedPost)
  })
})

app.use((request, response, next) => {
	response.status(404).json({
		error: 'Not Found'
	})
})

app.use((error, request, response, next) => {
  console.error(error)
  console.log(error.name)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'id used is malformed' })
  } else {
    response.status(500).end()
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
