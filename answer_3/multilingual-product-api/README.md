# Multilingual Product API

This repository serves as a starter for building a multilingual product API using the Nest framework with TypeScript. The project demonstrates creating and searching products with multilingual support

## Using

- #### NestJS
- #### PostgreSQL + typeorm
- #### Swagger UI

### Branch Selection

Ensure you're working on the master branch:

```bash
git checkout master
```

## Installation

1. Install the required dependencies:

```bash
$ npm install
```

2. Create an .env file at the root of the project with the following content to configure the database:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=pim
DB_PASSWORD=pass1234
DB_NAME=multilingual-product-db
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running Tests

```bash
$ npm run test
```

### PORT

```bash
 Please use port 8080
```

### Open Swagger

Open [http://localhost:8080/api/docs](http://localhost:8080/api/docs) with your browser to see the result.
