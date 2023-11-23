    ⚡ ~ endpoints: {
      'GET /api': {
        description: 'serves up a json representation of all the available endpoints of the api',
        queries: [],
        exampleResponse: 'See endpoints.json (this) for more information'
      },
      'GET /api/topics': {
        description: 'serves an array of all topics',
        queries: [],
        exampleResponse: { topics: [Array] }
      },
      'GET /api/articles': {
        description: 'serves an array of all articles',
        queries: [ 'topic' ],
        exampleResponse: { articles: [Array] }
      },
      'GET /api/articles/:article_id': {
        description: 'serves a single article',
        queries: [],
        exampleResponse: { article: [Object] }
      },
      'GET /api/articles/:article_id/comments': {
        description: 'serves an array of all comments for a given article',
        queries: [],
        exampleResponse: { comments: [Array] }
      },
      'POST /api/articles/:article_id/comments': {
        description: 'creates a new comment for a given article',
        queries: [],
        exampleResponse: { comment: [Object] }
      },
      'PATCH /api/articles/:article_id': {
        description: 'updates an existing article by ID',
        queries: [],
        exampleResponse: { article: [Object] }
      },
      'DELETE /api/comments/:comment_id': {
        description: 'deletes an existing comment by ID',
        queries: [],
        exampleResponse: { status: 204 }
      },
      'GET /api/users': {
        description: 'serves an array of all users',
        queries: [],
        exampleResponse: { users: [Array] }
      }
    }