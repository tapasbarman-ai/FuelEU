import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { container } from '../container';

const PORT = process.env.PORT || 3001;

async function bootstrap() {
    try {
        // Basic connectivity check via container
        await container.prisma.$connect();
        console.log('Database connected successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle shutdown gracefully
function shutdown() {
    console.log('\nShutting down gracefully...');
    container.destroy().then(() => {
        process.exit(0);
    });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

bootstrap();
