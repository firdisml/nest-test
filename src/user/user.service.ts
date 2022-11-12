import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUnique(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(user);
    return user;
  }

  async findText(search: string) {
    const result = await this.prisma.post.findMany({
      where: {
        car: {
          name: search,
        },
      },
    });

    return result;
  }
}
