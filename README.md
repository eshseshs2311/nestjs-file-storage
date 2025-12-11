nestjs-file-storage/
├─ package.json
├─ tsconfig.json
├─ .gitignore
├─ README.md
└─ src/
├─ index.ts
├─ service/file.service.ts
├─ interceptors/file-storage.interceptor.ts
├─ decorators/allowed-files.decorator.ts
└─ upload.module.ts

---

# nestjs-file-storage

NestJS File Storage Package – A complete solution for handling file uploads, replacements, moves, bulk operations, and deletions in NestJS applications.

## Features

* Save single or multiple files
* Replace single or multiple files
* Move single or multiple files
* Bulk delete files
* Delete entire folders
* File validation (size and type)
* NestJS decorator & interceptor integration
* Global UploadModule for easy access
* Ready for scoped npm package

## Installation

```bash
npm install @hassan23el/nestjs-file-storage
```

## Setup

### Import Global Module

```ts
import { Module } from '@nestjs/common';
import { UploadModule } from '@hassan23el/nestjs-file-storage';

@Module({
  imports: [UploadModule], // Import once in root module
})
export class AppModule {}
```

* With `@Global()` applied, `FileService` is available everywhere without importing `UploadModule` in other modules.

### Import Service Directly (Optional)

```ts
import { Module } from '@nestjs/common';
import { FileService } from '@hassan23el/nestjs-file-storage';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class SomeModule {}
```

---

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
  ) {
    savedFiles = dto.file_fileds    
    return { files: savedFiles };
  }
}
```

### Replace existing files

```ts
const oldPaths = ['ads/1/old1.jpg', 'ads/1/old2.jpg'];
const newFiles = dto.images; // from @UploadedFiles()
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

* Maximum number of files
* Maximum file size (MB)
* Allowed file types (default: images + PDF)

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
  AllowedFilesOptions,
  UploadModule
} from '@hassan23el/nestjs-file-storage';
```

* `FileService` – core file operations
* `FileStorageInterceptor` – NestJS interceptor
* `AllowedFiles` – decorator for validation
* `IMAGE_REGEX` – default regex for images
* `AllowedFilesOptions` – interface for options
* `UploadModule` – global module providing FileService

## License

MIT