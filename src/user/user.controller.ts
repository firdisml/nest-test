import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessGuard } from 'src/common/guard/access.guard';
import { AccessTokenDecorator } from 'src/common/decorator/access.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @UseGuards(AccessGuard)
  profile(@AccessTokenDecorator('email') email: string) {
    return this.userService.findUnique(email);
  }
}
