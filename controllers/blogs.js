const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blog => {
      response.json(blog)
    })
    .catch((error) => next(error))
})

blogRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      blog ? response.json(blog) : response.status(404).end()
    })
    .catch((error) => next(error))
})

blogRouter.post('/', (request, response, next) => {
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
    .catch((error) => next(error))
})

module.exports = blogRouter
