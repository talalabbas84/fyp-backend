process.env.UV_THREADPOOL_SIZE = 5;
const express = require('express');
const dotenv = require('dotenv');
const morgan = require(`morgan`);
const colors = require(`colors`);
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const cluster = require('cluster');
const bodyParser = require('body-parser');

const connectDb = require(`./config/db`);
const errorHandler = require(`./middleware/error`);

dotenv.config({ path: './config/config.env' });

if (cluster.isMaster) {
  cluster.fork();
  // cluster.fork();
  // cluster.fork();
  // cluster.fork();
} else {
  //Connect to db
  connectDb();

  const app = express();

  //Body parser
  app.use(express.json());
  app.use(bodyParser.json());

  // Dev logging middleware
  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  // File uploading
  app.use(fileupload());

  app.use(cookieParser());

  //Sanitize data
  app.use(mongoSanitize());

  //Set security headers
  app.use(helmet());
  // Prevent XSS attacks
  app.use(xss());

  //Rate limiting
  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
  });

  app.use(limiter);

  //Prevent http param pollution
  app.use(hpp());

  //Enable CORS
  app.use(cors());

  // Set static folder
  app.use(express.static(path.join(__dirname, 'public')));

  //Mount routers
  // app.use(`/api/v1/bootcamps`, bootcamps);

  app.use(errorHandler);

  const PORT = process.env.PORT || 5000;

  const server = app.listen(
    PORT,
    console.log(
      `Server running on in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    )
  );

  //Handle unhandled promise rejection
  process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close server & exit process
    server.close(() => process.exit(1));
  });
}
