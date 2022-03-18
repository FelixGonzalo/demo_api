// const http = require('http');
const { response } = require('express')
const express = require('express')
const cors = require('cors')
const logger = require('./loggerMiddleware')

const app = express()

//libre
app.use(cors())
//this is a middleware: con use pasan todos los tipos: get, post, etc.
app.use(express.json())
app.use(logger)

let posts = [
	{
		userId: 1,
		id: 1,
		title:
      'Gonzalo sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
		body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
	},
	{
		userId: 1,
		id: 2,
		title: 'qui est esse',
		body: 'est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla',
	},
	{
		userId: 1,
		id: 3,
		title: 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
		body: 'et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut',
	},
	{
		userId: 1,
		id: 4,
		title: 'eum et est occaecati',
		body: 'ullam et saepe reiciendis voluptatem adipisci\nsit amet autem assumenda provident rerum culpa\nquis hic commodi nesciunt rem tenetur doloremque ipsam iure\nquis sunt voluptatem rerum illo velit',
	},
	{
		userId: 1,
		id: 5,
		title: 'nesciunt quas odio',
		body: 'repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque',
	},
	{
		userId: 1,
		id: 6,
		title: 'dolorem eum magni eos aperiam quia',
		body: 'ut aspernatur corporis harum nihil quis provident sequi\nmollitia nobis aliquid molestiae\nperspiciatis et ea nemo ab reprehenderit accusantium quas\nvoluptate dolores velit et doloremque molestiae',
	},
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, {'Content-Type': 'application/json'})
//   response.end(JSON.stringify(posts))
// })
// app.listen(PORT)

app.get('/', ( request, response) => {
	response.send('<h1>hello world</h1>')
})

app.get('/api/posts', (request, response) => {
	response.json(posts)
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

	response.status().json(newPost)
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
