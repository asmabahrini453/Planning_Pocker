import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ApplicationModule } from './application/application.module';
import { BacklogModule } from './backlog/backlog.module';
import { UserStoryModule } from './user-story/user-story.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [UserModule, ApplicationModule, BacklogModule, UserStoryModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
