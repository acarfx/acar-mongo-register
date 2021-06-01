const { acar, Mongo } = require('./Global.main');
const client = global.client = new acar({ fetchAllMembers: true })

client.komutYükle("Register")
client.eventYükle("Handler")
client.login(sistem.token)

Mongo.Connect()