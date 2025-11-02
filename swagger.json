import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🎬 OBEDTECH Movie & TV API",
      version: "1.0.0",
      description:
        "Welcome to OBEDTECH's Movie & TV API. Use the endpoints below to manage or fetch movie data. Try them live!",
      contact: {
        name: "OBEDTECH",
        url: "https://obedtech-api.onrender.com",
        email: "support@obedtech.com",
      },
    },
    servers: [
      {
        url: "https://obedtech-api.onrender.com",
      },
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./server.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
