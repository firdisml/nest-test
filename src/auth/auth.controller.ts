import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { SignUpDto } from '../common/dto';
import { SignInDto } from '../common/dto';
import { AuthService } from './auth.service';
import { RefreshTokenDecorator } from 'src/common/decorator';
import { RefreshGuard } from 'src/common/guard';
import { AccessGuard } from 'src/common/guard/access.guard';
import { Response } from 'express';
import { refreshTokenCookieOptions } from 'src/common/option';
import { accessTokenCookieOptions } from 'src/common/option';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signup(signUpDto);
    response.cookie(
      'access_token',
      user.access_token,
      accessTokenCookieOptions,
    );
    if (user.refresh_token)
      response.cookie(
        'refresh_token',
        user.refresh_token,
        refreshTokenCookieOptions,
      );
  }

  @Post('signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.signin(signInDto);
    response.cookie(
      'access_token',
      user.access_token,
      accessTokenCookieOptions,
    );
    if (user.refresh_token)
      response.cookie(
        'refresh_token',
        user.refresh_token,
        refreshTokenCookieOptions,
      );
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  async logout(
    @RefreshTokenDecorator('user_id') user_id: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user_id);
    response.cookie('access_token', null, accessTokenCookieOptions);
    response.cookie('refresh_token', null, refreshTokenCookieOptions);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  async refresh(
    @RefreshTokenDecorator('user_id') user_id: string,
    @RefreshTokenDecorator('refresh_token') refresh_token: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.refreshTokens(user_id, refresh_token);
    response.cookie(
      'access_token',
      user.access_token,
      accessTokenCookieOptions,
    );
    if (user.refresh_token)
      response.cookie(
        'refresh_token',
        user.refresh_token,
        refreshTokenCookieOptions,
      );
  }
}
