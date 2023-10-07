const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const client = require('./query.js');
app.use(bodyParser.json());

const swaggerDefinition = require('./swagger'); 
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition,
  apis: ['./route/*.js'], 
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


const movies = require('./route/movie.js');
const users = require('./route/users.js');
app.use('/movies', movies);
app.use('/users', users)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
