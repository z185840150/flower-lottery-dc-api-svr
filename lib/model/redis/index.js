const [redis] = [require('redis')]
const [config] = [require('./../../../config')]

const client = redis.createClient(config.redis.port, config.redis.address)

typeof config.redis.password === 'string' &&
config.redis.password.length > 0 &&
client.auth(config.redis.password)

module.exports = client
