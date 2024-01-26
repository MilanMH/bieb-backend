const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
app.use(bodyParser.json());

const upload = multer({ dest: 'uploads/' }); // Slaat bestanden op in "uploads" map

// MySQL verbinding configureren
const db = mysql.createConnection({
    host: '10.0.0.69',
    user: 'mhut2269_bib',
    password: '97ObD41G8X9FVVAG',
    database: 'mhut2269_bib'
});

// Verbind met database
db.connect((err) => {
    if (err) throw err;
    console.log('MySQL verbonden...');
});

// Route om een boek toe te voegen, inclusief afbeelding
app.post('/add_book', upload.single('image_path'), (req, res) => {
    let imagePath = req.file ? req.file.path : ''; // Pad naar de afbeelding
    let book = {
        isbn: req.body.isbn,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        pages: req.body.pages,
        quantity: req.body.quantity,
        availability: req.body.quantity,
        image_path: imagePath
    };



    let sql = 'INSERT INTO books SET ?';
    db.query(sql, book, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding the book');
        } else {
            console.log('Book added, Image path:', imagePath);
            res.send('Book added to database');
        }
    });
});

// Route om alle boeken op te halen
app.get('/get_books', (req, res) => {
    let sql = 'SELECT *, CONCAT("uploads/", image_path) as image_path FROM books';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results.map(book => {
            // Zorg ervoor dat de image_path volledig is als de cover_image_path niet leeg is
            book.image_path = book.image_path ? `${req.protocol}://${req.get('host')}/${book.image_path}` : null;
            return book;
        }));
    });
});

app.post('/update_availability', (req, res) => {
    const { id, availability } = req.body;
    let sql = 'UPDATE books SET availability = ? WHERE id = ?';
    db.query(sql, [availability, id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating availability');
        } else {
            res.send('Availability updated');
        }
    });
});

app.delete('/delete_book/:id', (req, res) => {
    const { id } = req.params;
    let sql = 'DELETE FROM books WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting the book');
        } else {
            res.send('Book deleted successfully');
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server draait op port ${port}`);
});

