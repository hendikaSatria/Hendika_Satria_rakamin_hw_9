const express = require('express');
const router = express.Router();
const { protectRouteForUsers } = require('../middleware/middle.js'); 
const pool = require('../query.js');

// movies?page=1, movies?page=2
router.get('/', protectRouteForUsers, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const pageSize = 10; 
        const offset = (page - 1) * pageSize; 

        // use the LIMIT and OFFSET 
        const query = {
            text: 'SELECT * FROM movies ORDER BY id LIMIT $1 OFFSET $2',
            values: [pageSize, offset],
        };

        const movies = await pool.query(query);
        res.json({ movies: movies.rows });
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).json({ error: 'An error occurred while fetching movies' });
    }
});

router.get('/:id', protectRouteForUsers, async (req, res) => {
    try {
        const movieId = req.params.id;
        const result = await pool.query('SELECT * FROM movies WHERE id = $1', [movieId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ movie: result.rows[0] });
    } catch (error) {
        console.error('Error fetching a movie by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the movie' });
    }
});

router.post('/', protectRouteForUsers, async (req, res) => {
    try {
        const { title, genres, year } = req.body;
        if (!title || !genres || !year) {
            return res.status(400).json({ error: 'Please provide title, genres, and year' });
        }
        const result = await pool.query('INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3) RETURNING *', [title, genres, year]);
        res.status(201).json({ movie: result.rows[0] });
    } catch (error) {
        console.error('Error creating a movie:', error);
        res.status(500).json({ error: 'An error occurred while creating the movie' });
    }
});

router.put('/:id', protectRouteForUsers, async (req, res) => {
    try {
        const movieId = req.params.id;        
        const { title, genres, year } = req.body;    
        if (!title || !genres || !year) {
            return res.status(400).json({ error: 'Please provide title, genres, and year' });
        }
        const result = await pool.query('UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4 RETURNING *', [title, genres, year, movieId]);
        // check the id
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Movie not found.' });
        }
        res.json({ movie: result.rows[0] });
    } catch (error) {
        console.error('Error updating a movie:', error);
        res.status(500).json({ error: 'An error occurred while updating the movie' });
    }
});

router.delete('/:id', protectRouteForUsers, async (req, res) => {
    try {
        const movieId = req.params.id;
        const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [movieId]);
        // check the id
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        console.error('Error deleting a movie:', error);
        res.status(500).json({ error: 'An error occurred while deleting the movie' });
    }
});

module.exports = router;
