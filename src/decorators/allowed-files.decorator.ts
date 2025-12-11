import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import {
  FileStorageInterceptor,
  AllowedFilesOptions,
} from "../interceptors/file-storage.interceptor";
import { FileService } from "../service/file.service";

export function AllowedFiles(options: AllowedFilesOptions = {}) {
  const opts = { regex: options.regex, ...options };
  return applyDecorators(
    UseInterceptors(
      AnyFilesInterceptor({
        limits: { fileSize: (opts.maxSizeMB || 5) * 1024 * 1024 },
      }),
      new FileStorageInterceptor(new FileService(), opts)
    )
  );
}
