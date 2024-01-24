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
    let book = req.body;
    let sql = 'INSERT INTO books SET ?';
    db.query(sql, book, (err, result) => {
        if (err) throw err;
        res.send('Boek toegevoegd...');
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
    const { id, available } = req.body;
    let sql = 'UPDATE books SET available = ? WHERE id = ?';
    db.query(sql, [available, id], (err, result) => {
        if (err) throw err;
        res.send('Availability updated');
    });
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server draait op port ${port}`);
});
