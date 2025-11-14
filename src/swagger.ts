import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hackathon TecsUp API',
      version: '1.0.0',
      description: 'Documentación OpenAPI (Swagger) para la API'
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${process.env.PORT || 4000}`
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
