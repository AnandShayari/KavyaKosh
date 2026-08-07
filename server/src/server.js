import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import config from './config/index.js';
import connectDB from './config/database.js';
import passport from './config/passport.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(passport.initialize());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'KavyaKosh API', version: '1.0.0', description: 'AI Literary Platform API' },
    servers: [{ url: `http://localhost:${config.port}/api` }],
  },
  apis: ['./src/routes/*.js'],
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`KavyaKosh Server running on port ${config.port}`);
});

export default app;
