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

app.get('/', ( request, response) => {
	response.send('<h1>hello world</h1>')
})

app.get('/api/posts', (request, response) => {
	Post.find({}).then(posts => {
		response.json(posts)
	})
})

app.get('/api/posts/:id', (request, response) => {
	const id = Number(request.params.id)
	const post = posts.find(post => post.id === id)

	if (post) {
		response.json(post)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/posts/:id', (request, response) => {
	const id = Number(request.params.id)
	posts = posts.filter(post => post.id !== id)
	response.status(204).end()
})

app.post('/api/posts', (request, response) => {
	const post = request.body

	if (!post || !post.title || !post.body) {
		return response.status(400).json({
			error: 'post.title or post.body is missing'
		})
	}

	const ids = posts.map(post => post.id)
	const maxId = Math.max(... ids)

	const newPost = {
		userId: 1,
		id: maxId + 1,
		title: post.title,
		body: post.body,
		date: new Date().toISOString()
	}

	posts = [...posts, newPost]

	response.status(200).json(newPost)
})

app.use((request, response) => {
	response.status(404).json({
		error: 'Not Found'
	})
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
