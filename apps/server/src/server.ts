import { createServer } from 'node:http';
import { createApp } from './app.js';
import { serverConfig } from './config/env.js';
import { logger } from './config/logger.js';
import { disconnectPrisma } from './infrastructure/database/prisma.js';

const app = createApp();
const server = createServer(app);

server.listen(serverConfig.port, () => {
  logger.info(`API server listening on port ${serverConfig.port}`);
});

const shutdown = (signal: NodeJS.Signals) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  server.close(() => {
    void (async () => {
      await disconnectPrisma();
      process.exit(0);
    })();
  });
};

process.on('SIGINT', () => {
  shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
