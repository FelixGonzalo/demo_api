const mongoose = require('mongoose')

const connectionString = process.env.MONGO_DB_URI

mongoose.connect(connectionString)
	.then(() => {
		console.log('Database connected')
	})
	.catch(err => {
		console.log(err)
	})

// GUARDAR

// const post = new Post({
//   title: 'La demo',
//   body: 'hola demo',
//   date: new Date(),
//   important: true
// })

// post.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.log(err)
//   })

// BUSCAR

// Post.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })