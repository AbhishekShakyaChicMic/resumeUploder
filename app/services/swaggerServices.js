const { Schema } = require('mongoose');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-jsdoc');

const options = {
    definition: {
        openai: '3.0.0',
        info: {
            title: "REST API Docks",
            version
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: "http",
                    Schema: "bearer",
                    bearerAuth:"JWT"
                },
            },
        },
        security: [
            {
                bearerAuth:[],
            }
        ]
    }
    
}