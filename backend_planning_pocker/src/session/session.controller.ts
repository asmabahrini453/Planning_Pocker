import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { VoteSessionDto } from './dto/vote-session.dto';
import { VoteResultDto } from './dto/vote-result.dto';

@Controller('applications/:appId/sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

 @Post(':sessionId/vote')
vote(
  @Param('appId', ParseIntPipe) appId: number,
  @Param('sessionId', ParseIntPipe) sessionId: number,
  @Body() dto: VoteSessionDto,
): VoteResultDto {
  return this.sessionService.vote(appId, sessionId, dto);
}

}
