import { Controller, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/saveCard')
  async saveCard(@Res() res): Promise<any> {
    const session = await this.appService.saveCard();
    res.redirect(303, session.url);
  }

  @Post()
  async payments(@Res() res): Promise<any> {
    const session = await this.appService.payment();
    res.redirect(303, session.url);
  }
}
