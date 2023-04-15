const books = [
    {
        ISBN: "12345",
        title: "Tesla!!!",
        pubDate: "2021-08-05",
        language: "en",
        numpage: "250",
        author: [1,2],
        publications: [1],
        categort: ["tech","space","education"]
    }
]

const author = [
    {
        id: 1,
        name: "Rupayan",
        books: ["12345Book", "secretBook"]
    },
    {
        id: 2,
        name: "Elon Mush",
        books: ["12345Book"]
    }
]

const publication = [
    {
        id: 1,
        name: "writex",
        books: ["12345Book"]
    }
]

module.exports = {books, author, publication}
