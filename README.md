nestjs-file-storage/
├─ package.json
├─ tsconfig.json
├─ .gitignore
├─ README.md
└─ src/
   ├─ index.ts
   ├─ service/file.service.ts
   ├─ interceptors/file-storage.interceptor.ts
   └─ decorators/allowed-files.decorator.ts

---

# nestjs-file-storage

NestJS File Storage Package – A complete solution for handling file uploads, replacements, moves, bulk operations, and deletions in NestJS applications.

## Features

- Save single or multiple files
- Replace single or multiple files
- Move single or multiple files
- Bulk delete files
- Delete entire folders
- File validation (size and type)
- NestJS decorator & interceptor integration
- Ready for scoped npm package

## Installation

```bash
npm install @hassan23el/nestjs-file-storage
```

## Setup

Import the services in your NestJS module:

```ts
import { Module } from '@nestjs/common';
import { FileService } from '@hassan23el/nestjs-file-storage';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class UploadModule {}
```

## Usage

### Upload files with decorator

```ts
import { Controller, Post, Body, Param, UploadedFiles } from '@nestjs/common';
import { AllowedFiles, FileService } from '@hassan23el/nestjs-file-storage';

@Controller('ads')
export class AdsController {
  constructor(private readonly fileService: FileService) {}

  @Post(':id/images')
  @AllowedFiles({ maxFiles: 5, maxSizeMB: 10 })
  async uploadAdImages(
    @Param('id') id: string,
    @Body() dto,
    @UploadedFiles() files: Record<string, Express.Multer.File[]>
  ) {
    const savedFiles = await Promise.all(
      files.images.map(file => this.fileService.saveFile(file, `ads/${id}`))
    );
    return { files: savedFiles };
  }
}
```

### Replace existing files

```ts
const oldPaths = ['ads/1/old1.jpg', 'ads/1/old2.jpg'];
const newFiles = files.images; // from @UploadedFiles()
const newPaths = await this.fileService.replaceFiles(oldPaths, newFiles, `ads/${id}`);
```

### Move files

```ts
const moved = await this.fileService.moveFiles(['ads/1/file1.jpg'], 'archived/ads');
```

### Delete files or folders

```ts
await this.fileService.deleteFile('ads/1/file1.jpg');
await this.fileService.deleteFiles(['ads/1/file2.jpg', 'ads/1/file3.jpg']);
await this.fileService.deleteFolder('ads/1');
```

## Validation

Use `@AllowedFiles` decorator for:
- Maximum number of files
- Maximum file size (MB)
- Allowed file types (default: images + PDF)

```ts
@AllowedFiles({ maxFiles: 5, maxSizeMB: 10, regex: /\/(jpg|jpeg|png|gif|pdf)$/ })
```

## Directory Structure

```
uploads/
└─ temp/             # default temporary uploads
└─ ads/:id/          # custom entity folders
```

## Git Ignore Recommendations

```
node_modules/
dist/
uploads/
.env
.npmrc
```

## Exports

```ts
import {
  FileService,
  FileStorageInterceptor,
  AllowedFiles,
  IMAGE_REGEX,
  AllowedFilesOptions
} from '@hassan23el/nestjs-file-storage';
```

- `FileService` – core file operations
- `FileStorageInterceptor` – NestJS interceptor
- `AllowedFiles` – decorator for validation
- `IMAGE_REGEX` – default regex for images
- `AllowedFilesOptions` – interface for options

## License

MIT