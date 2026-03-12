"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const container_1 = require("../container");
const PORT = process.env.PORT || 3001;
async function bootstrap() {
    try {
        // Basic connectivity check via container
        await container_1.container.prisma.$connect();
        console.log('Database connected successfully.');
        app_1.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Handle shutdown gracefully
function shutdown() {
    console.log('\nShutting down gracefully...');
    container_1.container.destroy().then(() => {
        process.exit(0);
    });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
bootstrap();
//# sourceMappingURL=server.js.map