const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


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

// Route om een boek toe te voegen
app.post('/add_book', (req, res) => {
    let book = {
        isbn: req.body.isbn,
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        pages: req.body.pages,
        quantity: req.body.quantity,
        availability: req.body.quantity // Stel availability in op de ingevoerde quantity
    };
    let sql = 'INSERT INTO books SET ?';
    db.query(sql, book, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding the book');
        } else {
            res.send('Book added to database');
            console.log('boek is toegevoegd');
        }
    });
});

// Route om alle boeken op te halen
app.get('/get_books', (req, res) => {
    let sql = 'SELECT * FROM books';
    console.log('de boeken worden opgehaald')
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
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
            console.log('Availability updated');
        }
    });
});


const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server draait op port ${port}`);
});
