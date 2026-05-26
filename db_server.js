import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(jsonServer.bodyParser({ limit: '10mb' }))
server.use(middlewares)
server.use(router)

server.listen(3000, () => {
  console.log('JSON Server running')
})