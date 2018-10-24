'use strict'

const Koa = require('koa')
const koaCompress = require('koa-compress')
const koaCors = require('kcors')
const koaBody = require('koa-body')
const router = require('./router')
const config = require('./config')
const log = require('./logger')

const app = new Koa()

app.use(koaCompress())
app.use(koaCors())
app.use(koaBody())
app.use(router)

const services = {
  server: null,
}

app.start = async () => {
  log.info('Starting server.')

  services.server = await new Promise((resolve, reject) => {
    const listen = app.listen(config.port, err => err ? reject(err) : resolve(listen))
  })

  log.info('All services have started.')
}

app.stop = () => {
  log.info('Shutting down server.')
  services.server.close()
}

app.start()
  .then(() => log.info('App is running.'))
  .catch(err => log.error(err))

process.once('SIGINT', () => app.stop())
process.once('SIGTERM', () => app.stop())

