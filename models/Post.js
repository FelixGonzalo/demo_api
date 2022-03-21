const mongoose = require('mongoose')
const { model, Schema } = mongoose

const postSchema = new Schema({
  title: String,
  body: String,
  date: Date,
  important: Boolean,
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Post = model('Post', postSchema)

module.exports = Post
