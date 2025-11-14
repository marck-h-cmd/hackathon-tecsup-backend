import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectAllDatabases } from './config/database';
import userRoutes from './routes/User';
import chatRoutes from './routes/Chat';
import { ensureAdminUserExists } from './scripts/InitAdmin';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';
dotenv.config();

const app: Express = express();

// Conectar a MySQL con Sequelize (se puede omitir en desarrollo con SKIP_DB=true)
if (process.env.SKIP_DB === 'true') {
    console.log('SKIP_DB=true -> omitiendo conexiones a base de datos');
} else {
    connectAllDatabases().then(() => {
        console.log('Database connections ready');
        ensureAdminUserExists();
    }).catch((err) => {
        console.log('Error starting database:', err);
        process.exit(1);
    });
}

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/user', userRoutes);
app.use('/chat', chatRoutes);

// Swagger UI (OpenAPI)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs/json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handler
interface ErrorWithStatus extends Error {
    status?: number;
}

app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

const PORT = parseInt(process.env.PORT || '4000', 10);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
export default app;