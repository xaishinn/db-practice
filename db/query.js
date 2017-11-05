const pg = require('./knex')

let getBooks = () => {
  return pg('books').fullOuterJoin('book_character', 'book_character.book_id', 'books.id').fullOuterJoin('characters', 'characters.id', 'book_character.character_id').select()
    .then((data) => {
      let hitTitles = []
      let organizedData = []
      data.forEach((item) => {
        if (!hitTitles.includes(item.title)) {
          hitTitles.push(item.title)
          organizedData.push({ title: item.title, name: [item.name] })
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
  // bookTitle = {
  //   title: 'Something Fancy' 
  // }
  return new Promise(
    (resolve, reject) => {
      pg('books').first().where(bookTitle)
        .then((book) => {
          if (book) {
            resolve([book.id]);
          } else {
            pg('books').insert(bookTitle).returning('id')
              .then(resolve);
          }
        }
        )
    }
  )
}

let addCharacter = (characterName) => {
  // add a character if the character is not in the table
  // console.log(characterName)
  return new Promise(
    (resolve, reject) => {
      pg('characters').first().where(characterName)
        .then((character) => {
          if (character) {
            resolve([character.id]);
          } else {
            pg('characters').insert(characterName).returning('id')
              .then(resolve);
          }
        })
    }
  )
}

let addJoin = (book, name) => {
  let data = { book_id: book[0], character_id: name[0] }
  // add a relationship between a character and a book if it does not exist
  return new Promise((resolve, reject) => {
    pg('book_character').first().where(data)
      .then((join) => {
        if(join){
          resolve([join.id]);
        } else {
          pg('book_character').insert(data)
            .then(resolve);
        }
      })
  })
}

module.exports = {
  getBooks,
  addBook,
  addCharacter,
  addJoin
}
