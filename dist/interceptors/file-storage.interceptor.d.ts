import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { FileService } from "../service/file.service";
export interface AllowedFilesOptions {
    regex?: RegExp;
    maxFiles?: number;
    maxSizeMB?: number;
}
export declare class FileStorageInterceptor implements NestInterceptor {
    private readonly fileService;
    private options?;
    constructor(fileService: FileService, options?: AllowedFilesOptions | undefined);
    private setNestedValue;
    private handleFiles;
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
