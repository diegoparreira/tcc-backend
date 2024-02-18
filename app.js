const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./config/database');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

// Import models and associations
require('./src/models/associations');

// Get info of the server
const os = require('os');
const networkInterfaces = os.networkInterfaces();
// get local network address
const network = networkInterfaces['Wi-Fi'].find(network => network.family === 'IPv4');

const port = process.env.PORT || 3003;
const serverString = `http://${network.address}:${port}`;

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Juntos Backend API',
      version: '1.0.0',
      description: 'API documentation for the Juntos Backend app'
    },
    servers: [serverString]
  },
  apis: ['./src/routes/*.js']
};

// Import CRUD classes for tables here
const userRouter = require('./src/routes/users');
const contentRouter = require('./src/routes/contents');
const categoryRouter = require('./src/routes/categories');
const extraDocRouter = require('./src/routes/extraDocs');
const commentRouter = require('./src/routes/comments');
const answerRouter = require('./src/routes/answers');
const chatRouter = require('./src/routes/chat');

// Allow the use of JSON in requests
app.use(express.json());
app.use(cors());

// Define the main routes of the application
app.use('/users', userRouter);
app.use('/contents', contentRouter);
app.use('/categories', categoryRouter);
app.use('/extradocs', extraDocRouter);
app.use('/comments', commentRouter);
app.use('/answers', answerRouter);
app.use('/chat', chatRouter);

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Create swagger file
if(!fs.existsSync('./swagger.yaml')){
  fs.writeFileSync('./swagger.yaml', yaml.dump(swaggerDocs), 'utf8');
}

// Other Express settings and middleware

// Initialize the database
const init = async () => {
  try {
    await sequelize.authenticate(); // Verify connection to the database

    await sequelize
      .sync()
      .then(() => {
        // Initialize the server
        app.listen(port, () => {
          console.log(`Running server at port: ${port}`);
        });
      })
      .catch(err => console.error('Error: ', err));
  } catch (error) {
    console.error('Unable to connect to the database, error: ', error);
  }
}

init();