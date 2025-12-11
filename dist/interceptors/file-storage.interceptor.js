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
exports.FileStorageInterceptor = void 0;
const common_1 = require("@nestjs/common");
let FileStorageInterceptor = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var FileStorageInterceptor = _classThis = class {
        constructor(fileService, options) {
            this.fileService = fileService;
            this.options = options;
        }
        setNestedValue(obj, path, value) {
            const parts = path
                .replace(/\]/g, "")
                .split("[")
                .flatMap((p) => p.split("."))
                .filter(Boolean);
            let current = obj;
            for (let i = 0; i < parts.length; i++) {
                const key = parts[i];
                const nextKey = parts[i + 1];
                if (nextKey && /^\d+$/.test(nextKey))
                    current[key] = current[key] || [];
                else if (nextKey)
                    current[key] = current[key] || {};
                if (i === parts.length - 1)
                    current[key] = value;
                else
                    current = current[key];
            }
        }
        async handleFiles(dto, files) {
            if (!files || (Array.isArray(files) && files.length === 0))
                return dto;
            if (Array.isArray(files)) {
                const grouped = {};
                for (const file of files) {
                    const field = file.fieldname;
                    if (!grouped[field])
                        grouped[field] = [];
                    grouped[field].push(file);
                }
                files = grouped;
            }
            for (const fieldName of Object.keys(files)) {
                let fieldFiles = files[fieldName];
                if (!Array.isArray(fieldFiles))
                    fieldFiles = [fieldFiles];
                if (this.options?.maxFiles && fieldFiles.length > this.options.maxFiles) {
                    throw new common_1.BadRequestException(`Too many files for ${fieldName}`);
                }
                for (const file of fieldFiles) {
                    if (this.options?.regex && !file.mimetype.match(this.options.regex)) {
                        throw new common_1.BadRequestException(`Invalid file type for ${file.originalname}`);
                    }
                    if (this.options?.maxSizeMB &&
                        file.size > this.options.maxSizeMB * 1024 * 1024) {
                        throw new common_1.BadRequestException(`${file.originalname} exceeds max size`);
                    }
                }
                const savedPaths = await Promise.all(fieldFiles.map((file) => this.fileService.saveFile(file)));
                const value = savedPaths.length === 1 ? savedPaths[0] : savedPaths;
                this.setNestedValue(dto, fieldName, value);
            }
            return dto;
        }
        async intercept(context, next) {
            const request = context.switchToHttp().getRequest();
            const files = request.files;
            request.body = await this.handleFiles(request.body, files);
            return next.handle();
        }
    };
    __setFunctionName(_classThis, "FileStorageInterceptor");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FileStorageInterceptor = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FileStorageInterceptor = _classThis;
})();
exports.FileStorageInterceptor = FileStorageInterceptor;
