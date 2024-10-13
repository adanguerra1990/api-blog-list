const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const morgan = require('morgan')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

const url = process.env.MONGODB_URI

console.log('Conectando...', url)

mongoose.connect(url)
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((error) => {
    console.log('Error al conectar con MongoDB', error)
  })

app.use(express.json())

app.use(morgan('tiny'))

app.get('/', (request, response) => {
  response.send('<h1>Holaa Blogs</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blog => {
      response.json(blog)
    })
})

app.get('/api/blogs/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then(blog => {
      blog ? response.json(blog) : response.status(404).end()
    })
})

app.post('/api/blogs', (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save()
    .then(saveBlog => {
      response.status(201).json(saveBlog)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`)
})
