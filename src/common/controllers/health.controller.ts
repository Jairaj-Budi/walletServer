import { Controller, Get } from '@nestjs/common';
import * as os from 'os';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      pid: process.pid,
      memory: process.memoryUsage(),
      cpu: os.loadavg(),
      uptime: process.uptime(),
    };
  }
}
