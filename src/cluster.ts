import * as cluster from 'node:cluster';
import type { Worker } from 'node:cluster';
import { cpus } from 'os';
import { Logger } from '@nestjs/common';

const numCPUs = cpus().length;
const logger = new Logger('Cluster');

export function setupCluster(bootstrap: () => Promise<void>) {
  // Use type assertion for cluster
  const clusterInstance = cluster as unknown as {
    isPrimary: boolean;
    fork: () => Worker;
    on: (event: string, callback: (worker: Worker, code: number, signal: string) => void) => void;
    workers: { [key: string]: Worker | undefined };
  };

  if (clusterInstance?.isPrimary) {
    logger.log(`Master server started on ${process.pid}`);

    // Fork workers based on CPU cores
    for (let i = 0; i < numCPUs/2; i++) {
      clusterInstance.fork();
    }

    clusterInstance.on('exit', (worker, code, signal) => {
      logger.error(`Worker ${worker.process.pid} died. Restarting...`);
      clusterInstance.fork();
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      logger.log('SIGTERM signal received: closing HTTP server');
      
      Object.values(clusterInstance.workers).forEach(worker => {
        worker?.send('shutdown');
      });

      // Wait for workers to finish
      setTimeout(() => {
        process.exit(0);
      }, 30000);
    });

  } else {
    // Worker process
    bootstrap().then(() => {
      logger.log(`Worker server started on ${process.pid}`);
    });

    // Handle shutdown message from master
    process.on('message', (msg) => {
      if (msg === 'shutdown') {
        logger.log(`Worker ${process.pid} shutting down...`);
        setTimeout(() => {
          process.exit(0);
        }, 25000);
      }
    });
  }
} 