var express = require('express')
var app = express()

app.use(express.logger('dev'))
app.use(express.static(__dirname))
app.use(express.static(__dirname + '/..'))

app.get('/', function(req, res){
  res.sendfile('test/index.html')
})

app.listen(4000)
console.log('listening on port 4000')