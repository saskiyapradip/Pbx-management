// src/utils/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Unified Communications Platform API',
      version: '1.0.0',
      description: 'Auto-generated Swagger docs',
    },
    servers: [{ url: 'http://localhost:8080' }],
  },
  apis: ['./src/utils/swaggerDocs.ts'], // adjust path to your project
};

export const swaggerSpec = swaggerJSDoc(options);
