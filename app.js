const express = require('express')
const app = express()
const query = require('./db/query')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000

/**
 * SETUP
 */
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())
app.use('/', express.static('public'))

/**
 * Routes
 */
app.get('/', (req, res) => {
  query.getBooks()
  .then((books) => {
    const data = {
      title: 'poop',
      books: books
    };

    /**
     * { data }
     * ==
     * { data: data }
     */
    res.render('main', data)
  })
})

app.post('/add', (req, res) => {
  let bookTitle = {title: req.body.title}
  let characterName = {name: req.body.name}
  query.addBook(bookTitle)
  .then((data) => {
    console.log('DATA = ', data);
    let bookId = data
    query.addCharacter(characterName)
    .then((data) => {
      let characterId = data
      query.addJoin(bookId, characterId)
      .then(() => {
        res.redirect('/')
      })
    })
  })
})

/**
 * Init
 */
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
