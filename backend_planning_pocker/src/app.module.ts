import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ApplicationModule } from './application/application.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [UserModule, ApplicationModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
