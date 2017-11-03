const pg = require('./knex')

let getBooks = () => {
  return pg('books').fullOuterJoin('book_character', 'book_character.book_id', 'books.id').fullOuterJoin('characters', 'characters.id', 'book_character.character_id').select()
  .then((data) => {
    let hitTitles = []
    let organizedData = []
    data.forEach((item) => {
      if (!hitTitles.includes(item.title)) {
        hitTitles.push(item.title)
        organizedData.push({title: item.title, name: [item.name]})
      } else {
        organizedData.forEach((book) => {
          if (item.title === book.title) {
            book.name.push(item.name)
          }
        })
      }
    })
    return organizedData
  })
}

let addBook = (bookTitle) => {
  // add a book if the title is not in the table
  return pg('books').insert(bookTitle).returning('id');
}

let addCharacter = (characterName) => {
  // add a character if the character is not in the table
  console.log(characterName)
  return pg('characters').insert(characterName).returning('id');
}

let addJoin = (book, name) => {
  let data = {book_id: book[0], character_id: name[0]}
  // add a relationship between a character and a book if it does not exist
  return pg('book_character').insert(data);
}

module.exports = {
  getBooks,
  addBook,
  addCharacter,
  addJoin
}
