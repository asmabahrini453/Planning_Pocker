import { Module } from '@nestjs/common';
import { BacklogService } from './backlog.service';
import { BacklogController } from './backlog.controller';

@Module({
  providers: [BacklogService],
  controllers: [BacklogController]
})
export class BacklogModule {}
