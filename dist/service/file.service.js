"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
let FileService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileService = _classThis = class {
        constructor(baseDir) {
            this.uploadDir = (0, path_1.join)(process.cwd(), baseDir || "uploads");
        }
        /** Save a single file */
        async saveFile(file, subDir = "temp") {
            const dir = (0, path_1.join)(this.uploadDir, subDir);
            await fs_1.promises.mkdir(dir, { recursive: true });
            const ext = file.originalname.split(".").pop();
            const filename = `${(0, crypto_1.randomUUID)()}.${ext}`;
            const filepath = (0, path_1.join)(dir, filename);
            if (file.buffer)
                await fs_1.promises.writeFile(filepath, file.buffer);
            else if (file.path) {
                const content = await fs_1.promises.readFile(file.path);
                await fs_1.promises.writeFile(filepath, content);
            }
            else
                throw new Error("File has no buffer or path");
            return `${subDir}/${filename}`;
        }
        /** Delete a single file */
        async deleteFile(relativePath) {
            const fullPath = (0, path_1.join)(this.uploadDir, relativePath);
            if (await fs_1.promises.stat(fullPath).catch(() => false))
                await fs_1.promises.unlink(fullPath);
        }
        /** Bulk delete files */
        async deleteFiles(paths) {
            await Promise.all(paths.map((p) => this.deleteFile(p)));
        }
        /** Replace a single file */
        async replaceFile(oldPath, newFile, subDir) {
            if (oldPath)
                await this.deleteFile(oldPath);
            return this.saveFile(newFile, subDir);
        }
        /** Bulk replace files */
        async replaceFiles(oldPaths, newFiles, subDir) {
            const results = [];
            for (let i = 0; i < newFiles.length; i++) {
                const saved = await this.replaceFile(oldPaths[i], newFiles[i], subDir);
                results.push(saved);
            }
            return results;
        }
        /** Move a single file */
        async moveFile(currentPath, newSubDir) {
            const oldFull = (0, path_1.join)(this.uploadDir, currentPath);
            const filename = currentPath.split("/").pop();
            const newDir = (0, path_1.join)(this.uploadDir, newSubDir);
            await fs_1.promises.mkdir(newDir, { recursive: true });
            const newFull = (0, path_1.join)(newDir, filename);
            await fs_1.promises.rename(oldFull, newFull);
            return `${newSubDir}/${filename}`;
        }
        /** Move multiple files */
        async moveFiles(paths, newSubDir) {
            const newDir = (0, path_1.join)(this.uploadDir, newSubDir);
            await fs_1.promises.mkdir(newDir, { recursive: true });
            const results = await Promise.all(paths.map(async (currentPath) => {
                const filename = currentPath.split("/").pop();
                const oldFull = (0, path_1.join)(this.uploadDir, currentPath);
                const newFull = (0, path_1.join)(newDir, filename);
                await fs_1.promises.rename(oldFull, newFull);
                return `${newSubDir}/${filename}`;
            }));
            return results;
        }
        /** Delete entire folder */
        async deleteFolder(subDir) {
            const dir = (0, path_1.join)(this.uploadDir, subDir);
            if (await fs_1.promises.stat(dir).catch(() => false))
                await fs_1.promises.rm(dir, { recursive: true, force: true });
        }
    };
    __setFunctionName(_classThis, "FileService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileService = _classThis;
})();
exports.FileService = FileService;
