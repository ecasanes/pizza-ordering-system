let express = require('express');
let app = express();

/* app.get('/', (req, res) => {
  res.send('Hello World');
}); */

app.use(express.static(__dirname + '/public'))
app.listen(3000);