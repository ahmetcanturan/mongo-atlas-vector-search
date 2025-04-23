# MongoDB Vector Search Demo

This project demonstrates semantic search capabilities using MongoDB Atlas Vector Search and OpenAI embeddings.

## What is Vector Search?

Vector search is a technique that allows searching data based on semantic similarity rather than exact text matching. It works by:

1. Converting text or content into numerical vectors (embeddings) that capture semantic meaning
2. Storing these vectors in a database that supports vector operations
3. Finding similar content by measuring the distance between vectors in multidimensional space

This enables more intuitive search experiences where results match the meaning of a query, not just keywords.

## MongoDB Atlas Vector Search

This project uses MongoDB Atlas Vector Search, which allows you to:

- Store vector embeddings alongside your document data
- Create vector search indexes for efficient similarity searches
- Perform semantic searches using the $vectorSearch aggregation operator
- Integrate with your existing MongoDB data model

The project uses the OpenAI API to generate embeddings for recipe data.

## Environment Setup

You'll need:

- Node.js (v14 or higher)
- MongoDB Atlas account with a cluster that supports vector search
- OpenAI API key

## Installation

```bash
$ npm install
```

## Environment Configuration

Create a `.env` file in the project root with:

```
MONGODB_URI=mongodb+srv:/...

OPENAI_API_KEY=<your-openai-api-key>
```

## Indexing in Atlas

1. Create a MongoDB Atlas cluster with vector search capabilities
2. Create a vector search index in the MongoDB Atlas UI:

```
{
  "fields": [
    {
      "type": "vector",
      "path": "plot_embedding",
      "similarity": "cosine",
      "numDimensions": 1536,
      "quantization": "scalar"
    }
  ]
}
```

## Seeding the Database

Populate the database with sample recipe data:

```bash
$ npm run seed
```

## Generating Embeddings

Generate vector embeddings for the recipes using OpenAI's embedding model:

```bash
$ npm run generate-embeddings
```

## Running the Application

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Viewing the Vector Search Page

Once the application is running:

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a natural language query in the search box (e.g., "pasta with tomato sauce")
3. Adjust the maximum number of results if desired
4. Click "Search" to see semantically similar recipes

<img src="/public/ui-example.png" alt="Vector Search">

## API Endpoints

- `POST /recipes/search` - Vector search endpoint (accepts JSON with `query` and optional `limit` fields)
- `GET /recipes` - Get all recipes
- `GET /recipes/:id` - Get a specific recipe
- `POST /recipes` - Create a new recipe
- `PATCH /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

## Contact

[Linkedin](https://www.linkedin.com/in/ahmetcanturan)

[Mail](mailto:ahmetcanturan.dev@gmail.com)
