import React, { useState, useEffect } from 'react';

function App() {
    const [books, setBooks] = useState([]);
    //new book inputs
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    //update book id
    const [editId, setEditId] = useState(null);

    // Fetch books from server
    useEffect(() => {
        fetch('http://localhost:5000/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, []);

    // Add a new book
    const addBook = () => {
        fetch('http://localhost:5000/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        })
        .then(response => response.json())
        .then(newBook => {
            setBooks([...books, newBook]);
            setName('');
            setDescription('');
        });
    };

    // Update an existing book
    const updateBook = (id) => {
        fetch(`http://localhost:5000/books/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        })
        .then(response => response.json())
        .then(updatedBook => {
          const updatedBooksArr = [];
          books.forEach(book => {
            if(book.id == id)
            {
              updatedBooksArr.push(updatedBook);
            }
            else
            {
              updatedBooksArr.push(book);
            }
          })
          setBooks(updatedBooksArr);
          setName('');
          setDescription('');
          setEditId(null);
        });
    };

    // Delete a book
    const deleteBook = (id) => {
        fetch(`http://localhost:5000/books/${id}`, { method: 'DELETE' })
            .then(() => setBooks(books.filter(book => book.id !== id)));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            updateBook(editId);
        } else {
            addBook();
        }
    };

    return (
        <div className="App">
            <h1>Book Management</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Book Name" value={name} onChange={(e) => setName(e.target.value)}/>
                <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                <button type="submit">{editId ? 'Update' : 'Add'} Book</button>
            </form>

            <ul>
                {books.map((book) => (
                    <li key={book.id}>
                        <strong>{book.name}</strong>: {book.description}
                        <button onClick={() => {
                            setEditId(book.id);
                            setName(book.name);
                            setDescription(book.description);
                        }}>Edit</button>
                        <button onClick={() => deleteBook(book.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
