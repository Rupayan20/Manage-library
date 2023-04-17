require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");

//Database
const database = require("./database/database");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// initialize express
const managelibrary = express();

managelibrary.use(bodyParser.urlencoded({extended: true}));
managelibrary.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}
).then(() => console.log("Connection Established"));


/* 
Route         /
Description   Get all the books
Access        Public
Parameters    None
Methods       Get
*/
managelibrary.get("/",async (req, res) => {
    const getAllBooks = await BookModel.findOne({ISBN: req.params.isbn});
    return res.json({getAllBooks});
});


/* 
Route         /is
Description   Get specific book on ISBN
Access        Public
Parameters    isbn
Methods       Get
*/
managelibrary.get("/is/:isbn",async (req, res) => {

    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

// Null !0=1; !1=0
    if(!getSpecificBook) {
        return res.json({error: 'No book found for the ISBN of ${req.params.isbn}'})
    }

    return res.json({books: getSpecificBook});
});  


/* 
Route         /c
Description   Get specific book on Category
Access        Public
Parameters    category
Methods       Get
*/
managelibrary.get("/c/:category",async (req, res) => {
    const getSpecificBook = await BookModel.findOne({category: req.params.category});

// Null !0=1; !1=0
    if(!getSpecificBook) {
        return res.json({error: 'No book found for the category of ${req.params.category}'})
    }

    return res.json({books: getSpecificBook});
});  


/* 
Route         /lan
Description   Get specific book on ISBN
Access        Public
Parameters    language
Methods       Get
*/
managelibrary.get("/lan/:language", (req, res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    );

    if(getSpecificBook.length === 0) {
        return res.json({error: 'No book found for the language of ${req.params.language}'})
    }

    return res.json({books: getSpecificBook});
});  


/* 
Route         /author
Description   Get all authors
Access        Public
Parameters    None
Methods       Get
*/
managelibrary.get("/",async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({getAllAuthors});
});


/* 
Route         /author
Description   Get specific author
Access        Public
Parameters    id
Methods       Get
*/
managelibrary.get("/author/:id", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => book.id === req.params.id
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: 'No book found for the Author of ${req.params.id}'})
    }

    return res.json({author: getSpecificAuthor});
});  


/* 
Route         /author/book
Description   Get all authors on books
Access        Public
Parameters    isbn
Methods       Get
*/
managelibrary.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );

    if(getSpecificAuthor.length === 0) {
        return res.json({error: 'No author found for the book of ${req.params.isbn}'});
    }

    return res.json({books: getSpecificBook});
}); 


/* 
Route         /publications
Description   Get all publications
Access        Public
Parameters    None
Methods       Get
*/
managelibrary.get("/",async (req, res) => {
    const getAllPublications = await PublicationModel.find();
    return res.json({getAllPublications});
});




// Post
/* 
Route         /book/new
Description   Add new books
Access        Public
Parameters    None
Methods       Post
*/
managelibrary.post("/book/new",async (req, res) => {
    const { newBook } = req.body;
    const addNewBook = BookModel.create(newBook);
    return res.json({
        books: addNewBook,
        message: "Book was added!"
    });
});



/* 
Route         /author/new
Description   Add new authors
Access        Public
Parameters    None
Methods       Post
*/
managelibrary.post("/author/new",async (req, res) => {
    const { newAuthor } = req.body;
    const addNewAuthor = BookModel.create(newAuthor);
    return res.json({
        authors: addNewBook,
        message: "Author was added!"
    });
});


/* 
Route         /publication/new
Description   Add new publications
Access        Public
Parameters    None
Methods       Post
*/
managelibrary.post("/publication/new",async (req, res) => {
    const { newPublication } = req.body;
    const addNewPublication = BookModel.create(newPublication);
    return res.json({
        publications: addNewPublication,
        message: "Publication was added!"
    });
});



/***********Put************/
/* 
Route         /book/update
Description   Update book on isbn
Access        Public
Parameters    isbn
Methods       Put
*/
managelibrary.put("/book/update/:isbn", async (req, res) => {
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            title: req.body.bookTitle
        },
        {
            new: true
        }
    );

    return res.json({
        books: updateBook
    });
});



/*******Updating new author*******/
/* 
Route         /publication/update/book
Description   Update/Add new publications
Access        Public
Parameters    isbn
Methods       Put
*/
managelibrary.put("/book/author/update/:isbn", async(req, res) =>{
    //update book database
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $push: {
                authors: req.body.newAuthor
            }
        },
        {
            new: true
        }
    );
    //update the author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.body.newAuthor
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    return res.json(
        {
            bookss: updatedBook,
            authors: updatedAuthor,
            message: "New author was added"
        }
    );
});



/* 
Route         /publication/update/book
Description   Update/Add new publications
Access        Public
Parameters    isbn
Methods       Put
*/
managelibrary.put("/publication/update/book/:isbn", (req, res) =>  {
    // Update the  publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId) {
          return pub.books.push(req.params.isbn)  
        }
    });

    // Update the book database
    database.book.forEach((book) => {
        if(book.isbn === req.params.isbn) {
            book.publications = req.body.pubId;
            return;
        }
    });

    return res.json(
       {
        books: database.books,
        publications: database.publication,
        message: "Successfully updated publications"
       } 
    );
});



/***** Delete *****/
/* 
Route         /book/delete
Description   Delete a book
Access        Public
Parameters    isbn
Methods       Delete
*/
managelibrary.delete("/book/delete/:isbn", (req, res) => {
    // Whichever book that doesn't match with the isbn, just send it to an updatedBookDatabase array
    // and rest will be filtered out
    const updatedBookDatabase= database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    return res.json({books: database.books});
});



/* 
Route         /book/delete/author
Description   Delete an author from book and vice versa
Access        Public
Parameters    isbn, authorId
Methods       Delete
*/
managelibrary.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    // Update the book database with
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });

    // Update the author database
    database.author.forEach((eachAuthor) => {
        if (eachAuthor.id === parseInt(req.params.authorId)) {
            const newBookList = eachAuthor.book.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
    });

    return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted!"
    })
});



managelibrary.listen(4000, () =>{
    console.log("Server is up and running");
});
