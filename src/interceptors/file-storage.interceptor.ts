import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { FileService } from "../service/file.service";

export interface AllowedFilesOptions {
  regex?: RegExp;
  maxFiles?: number;
  maxSizeMB?: number;
}

@Injectable()
export class FileStorageInterceptor implements NestInterceptor {
  constructor(
    private readonly fileService: FileService,
    private options?: AllowedFilesOptions
  ) {}

  private setNestedValue(obj: any, path: string, value: any) {
    const parts = path
      .replace(/\]/g, "")
      .split("[")
      .flatMap((p) => p.split("."))
      .filter(Boolean);
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
      const key = parts[i];
      const nextKey = parts[i + 1];
      if (nextKey && /^\d+$/.test(nextKey)) current[key] = current[key] || [];
      else if (nextKey) current[key] = current[key] || {};
      if (i === parts.length - 1) current[key] = value;
      else current = current[key];
    }
  }

  private async handleFiles(dto: any, files: any) {
    if (!files || (Array.isArray(files) && files.length === 0)) return dto;

    if (Array.isArray(files)) {
      const grouped: Record<string, Express.Multer.File[]> = {};
      for (const file of files) {
        const field = file.fieldname;
        if (!grouped[field]) grouped[field] = [];
        grouped[field].push(file);
      }
      files = grouped;
    }

    for (const fieldName of Object.keys(files)) {
      let fieldFiles = files[fieldName];
      if (!Array.isArray(fieldFiles)) fieldFiles = [fieldFiles];

      if (this.options?.maxFiles && fieldFiles.length > this.options.maxFiles) {
        throw new BadRequestException(`Too many files for ${fieldName}`);
      }

      for (const file of fieldFiles) {
        if (this.options?.regex && !file.mimetype.match(this.options.regex)) {
          throw new BadRequestException(
            `Invalid file type for ${file.originalname}`
          );
        }
        if (
          this.options?.maxSizeMB &&
          file.size > this.options.maxSizeMB * 1024 * 1024
        ) {
          throw new BadRequestException(
            `${file.originalname} exceeds max size`
          );
        }
      }

      const savedPaths = await Promise.all(
        fieldFiles.map((file: Express.Multer.File) =>
          this.fileService.saveFile(file)
        )
      );
      const value = savedPaths.length === 1 ? savedPaths[0] : savedPaths;
      this.setNestedValue(dto, fieldName, value);
    }

    return dto;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;
    request.body = await this.handleFiles(request.body, files);
    return next.handle();
  }
}
