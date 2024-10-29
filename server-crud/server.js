const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory book data
let books = [
    {id: 1, name: "The Best Dragon", description: "A book about the best dragon"},
    {id: 2, name: "The worst Dragon", description: "A book about the worst dragon"},
    {id: 3, name: "The Chair I Used To Like", description: "A heart breaking story about a man and his furniture"},
    {id: 4, name: "Why No One Eats Carrots", description: "Dr. Smile and her shocking new discovery"},
    {id: 5, name: "The Lake under my tree", description: "Another auther telling us about their magical childhood in too many pages"}
];

// READ: Get all books
app.get('/books', (req, res) => {
    res.json(books);
});

// CREATE: Add a new book
app.post('/books', (req, res) => {
    let maxId = 0;
    books.forEach(book => {
        if(book.id > maxId)
            maxId = book.id;
    });
    const newBook = {
        id: maxId + 1,
        name: req.body.name,
        description: req.body.description
    };
    books.push(newBook);
    res.status(201).json(newBook);
});

// UPDATE: Update a book
app.put('/books/:id', (req, res) => {
    const id = req.params.id;
    const bookIndex = books.findIndex(book => book.id == id);

    if (bookIndex !== -1)
    {
        let book = books[bookIndex];
        if(req.body.name != "")
            book.name = req.body.name;
        if(req.body.description != "")
            book.description = req.body.description;
        books[bookIndex] = book;
        res.json(book);
    }
    else
    {
        res.status(404).json({ message: 'Book not found' });
    }
});

// DELETE: Delete a book
app.delete('/books/:id', (req, res) => {
    const id = req.params.id;
    books = books.filter(book => book.id != id);
    res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
