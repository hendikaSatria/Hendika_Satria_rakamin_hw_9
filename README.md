# Hendika_Satria_rakamin_hw_9
restfull api

# Movie API

This repository contains the code for a movie-related API with user authentication and protected routes.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
## Features

- User authentication with JSON Web Tokens (JWT).
- Protected routes for authorized users.
- Movie-related routes, including listing, retrieving by ID, creating, updating, and deleting movies.
- Pagination for listing movies.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- A PostgreSQL database for storing user and movie data.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/movie-api.git
   cd movie-api

2. Install dependencies:
   ```bash
   npm i bcrypt dotenv express jsonwebtoken pg swagger-jsdoc swagger-ui-express

4. Setting up environment in .env for PostgreSQL connection and jwt secret key:
   ```env
    JWT_SECRET_KEY=your-secret-key
    PG_USER=your-username
    PG_HOST=you-host
    PG_DATABASE=your-database
    PG_PASSWORD=your-password
    PG_PORT=your-port

## API Endpoints

The API is available at `http://localhost:3000`.

### Movie Routes

All movie-related routes are protected for authorized users.

- `GET /movies`: List movies with pagination.
  - Retrieve a list of movies with pagination support. Returns a JSON array of movies.

- `GET /movies/:id`: Retrieve a movie by ID.
  - Retrieve a specific movie by its unique ID. Returns a JSON object representing the movie.

- `POST /movies`: Create a new movie.
  - Create a new movie record. Requires authentication. Expects a JSON payload with movie details.

- `PUT /movies/:id`: Update an existing movie.
  - Update an existing movie by its ID. Requires authentication. Expects a JSON payload with updated movie details.

- `DELETE /movies/:id`: Delete a movie.
  - Delete a movie by its ID. Requires authentication. Returns a confirmation message upon successful deletion.

