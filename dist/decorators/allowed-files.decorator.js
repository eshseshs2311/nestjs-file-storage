"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedFiles = AllowedFiles;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_storage_interceptor_1 = require("../interceptors/file-storage.interceptor");
const file_service_1 = require("../service/file.service");
function AllowedFiles(options = {}) {
    const opts = { regex: options.regex, ...options };
    return (0, common_1.applyDecorators)((0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)({
        limits: { fileSize: (opts.maxSizeMB || 5) * 1024 * 1024 },
    }), new file_storage_interceptor_1.FileStorageInterceptor(new file_service_1.FileService(), opts)));
}
