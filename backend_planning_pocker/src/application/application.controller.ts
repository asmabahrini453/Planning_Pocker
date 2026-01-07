import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplicationService } from './application.service';
import { Application } from '../common/models/application.model';
import { Session } from '../common/models/session.model';
import { CreateSessionDto } from '../session/dto/create-session.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly appService: ApplicationService) {}

  // 🔥 IMPORTATION RÉELLE DU BACKLOG JSON
  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  importBacklog(@UploadedFile() file: Express.Multer.File): Application {
    return this.appService.importApplicationFromFile(file);
  }

  @Get()
  findAll(): Application[] {
    return this.appService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Application {
    return this.appService.findById(id);
  }

  @Post(':id/sessions')
  createSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSessionDto,
  ): Session {
    return this.appService.createSession(id, dto);
  }
}
