import { Controller, UseInterceptors, Post } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { UploadedFiles } from '@nestjs/common';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  async uploadFile(
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
  ) {
    const result = await this.postService.uploadPublicFile(
      files.avatar[0].buffer,
    );
    return result;
  }
}
