// IS727272 - Cordero Hernández, Marco Ricardo

// Módulos
const dotenv = require('dotenv');
const axios = require('axios');

// Obtener llave de API
dotenv.config();
const API_KEY = process.env.API_KEY;

const API_URL = 'https://newsapi.org/v2/everything?q=';

module.exports = {
    list: (req, res) => {
        const searchTerm = encodeURIComponent(req.query.search);
        console.log(searchTerm);
        
        axios.get(`${API_URL}${searchTerm}&apiKey=${API_KEY}`)
            .then(response => {
                res.render('results', {
                        total: response.data.totalResults,
                        articles: response.data.articles  
                    }
                );         
            }).catch(err => {
                    res.send('Un error inesperada ha ocurrido, intenta de nuevo...');
                    console.log(err);
                }
            );
    }
};
