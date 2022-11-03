import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { SignUpDto } from '../common/dto/signup.dto';
import { TokenType } from 'src/common/type';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signup(signUpDto: SignUpDto): Promise<TokenType> {
    //DTO
    const { email, password } = signUpDto;

    //Check existing user
    const check = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //Throw exception if email existed
    if (check) {
      throw new ForbiddenException('Access denied!');
    }

    //Hash password
    const hash = await this.hashData(password);

    //Insert new user
    const user = await this.prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    });

    //Generate refresh & access token
    const tokens = await this.getToken(user.id, user.email);

    //Update user refresh token
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    //return token
    return tokens;
  }

  async signin(signUpDto: SignUpDto) {
    //DTO
    const { email, password } = signUpDto;

    //Check existing user
    const check = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //Throw exception if email existed
    if (!check) {
      console.log('error!');
      throw new ForbiddenException('Access denied!');
    }

    //Compare password with argon2
    const password_check = await argon2.verify(check.password, password);

    //Throw error if password not same
    if (!password_check) {
      throw new ForbiddenException('Access Denied!');
    }

    //Generate refresh & access token
    const tokens = await this.getToken(check.id, check.email);

    //Update user refresh token
    await this.updateRefreshToken(check.id, tokens.refresh_token);

    //return token
    return tokens;
  }

  async refreshTokens(
    user_id: string,
    refresh_token: string,
  ): Promise<TokenType> {
    //Check if user is exist
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    //Throw error if user or refresh token does not exist
    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access Denied!');
    }

    //Compare hashed refresh token from database with the one provided
    const check = await argon2.verify(user.refresh_token, refresh_token);

    //Throw error if refresh token is not same
    if (!check) {
      throw new ForbiddenException('Access Denied!');
    }

    //Issue new access token and refresh token
    const tokens = await this.getToken(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(user_id: string) {
    await this.prisma.user.updateMany({
      where: {
        id: user_id,
        refresh_token: {
          not: null,
        },
      },
      data: {
        refresh_token: null,
      },
    });
  }

  hashData(data: string) {
    //Hash data using argon
    return argon2.hash(data);
  }

  async updateRefreshToken(user_id: string, refresh_token: string) {
    //Hash refresh token with argon2
    const hash = await this.hashData(refresh_token);

    //Update user's refresh token in database
    await this.prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        refresh_token: hash,
      },
    });
  }

  async getToken(user_id: string, email: string): Promise<TokenType> {
    //Sign user' JWT access and refresh token
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          user_id: user_id,
          email,
        },
        {
          secret: 'access-secret',
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          user_id: user_id,
          email,
        },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      ),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }
}
