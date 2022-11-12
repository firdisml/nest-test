import {
  Controller,
  Get,
  UseGuards,
  CacheInterceptor,
  UseInterceptors,
  CacheTTL,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AccessGuard } from 'src/common/guard/access.guard';
import { AccessTokenDecorator } from 'src/common/decorator/access.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(AccessGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(20)
  profile(@AccessTokenDecorator('email') email: string) {
    return this.userService.findUnique(email);
  }

  @Get('search?')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  search(@Query('name') name: string) {
    return this.userService.findText(name);
  }
}
