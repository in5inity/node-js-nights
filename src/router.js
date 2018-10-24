'use strict'

const Router = require('koa-router')
const dogs = require('./dogs')

const router = new Router()
const { validate } = require('./utils/validation')

function validateInternal(ctx) {
  const schema = {
    type: 'Object',
    required: true,
    additionalProperties: false,
    properties: {
      id: {
        type: 'integer',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      breed: {
        type: 'string',
        required: true,
      },
      birthYear: {
        type: 'number',
      },
      photo: {
        type: 'string',
        format: 'url',
      },
    },
  }

  const validation = validate(ctx.request.body, schema)
  if (!validation.valid) {
    ctx.status = 400
    ctx.body = {
      errors: validation.errors,
    }
    return false
  }
  return true
}

function findDog(index) {
  return dogs.find(item => item.id === index)
}

// READ operation

router.get('/', ctx => {
  ctx.body = 'Welcome to DogBook!'
})

router.get('/dogs', ctx => {
  ctx.body = dogs
})

router.get('/dogs/:id', ctx => {
  const dog = findDog(Number(ctx.params.id))

  if (!dog) {
    ctx.status = 404
    return
  }
  ctx.body = dog
})

// DELETE operation

router.delete('/dogs', ctx => {
  ctx.status = 404
})

router.delete('/dogs/:id', ctx => {
  const dog = findDog(Number(ctx.params.id))

  if (!dog) {
    ctx.status = 400
    return
  }

  dogs.splice(dogs.indexOf(dog), 1)
  ctx.body = dogs
})

// UPDATE operation

router.put('/dogs', ctx => {
  if (!validateInternal(ctx)) {
    return
  }

  const dogUpdate = ctx.request.body
  const dog = findDog(Number(dogUpdate.id))

  if (!dog) {
    ctx.status = 404
    return
  }

  dogs.splice(dogs.indexOf(dog), 1)
  // add updated values (for now to the end...)
  dogs.push(dogUpdate)
  ctx.body = dogs
})

// CREATE operation

router.post('/dogs', ctx => {
  if (!validateInternal(ctx)) {
    return
  }

  // check that the id is not yet used...
  const dog = findDog(Number(ctx.request.body.id))
  if (!dog) {
    dogs.push(ctx.request.body)
    ctx.body = dogs
    return
  }

  ctx.status = 400
})

module.exports = router.routes()
