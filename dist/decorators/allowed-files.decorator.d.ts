import { AllowedFilesOptions } from "../interceptors/file-storage.interceptor";
export declare function AllowedFiles(options?: AllowedFilesOptions): <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
