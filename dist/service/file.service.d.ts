export declare class FileService {
    private uploadDir;
    constructor(baseDir?: string);
    /** Save a single file */
    saveFile(file: Express.Multer.File, subDir?: string): Promise<string>;
    /** Delete a single file */
    deleteFile(relativePath: string): Promise<void>;
    /** Bulk delete files */
    deleteFiles(paths: string[]): Promise<void>;
    /** Replace a single file */
    replaceFile(oldPath: string, newFile: Express.Multer.File, subDir?: string): Promise<string>;
    /** Bulk replace files */
    replaceFiles(oldPaths: string[], newFiles: Express.Multer.File[], subDir?: string): Promise<string[]>;
    /** Move a single file */
    moveFile(currentPath: string, newSubDir: string): Promise<string>;
    /** Move multiple files */
    moveFiles(paths: string[], newSubDir: string): Promise<string[]>;
    /** Delete entire folder */
    deleteFolder(subDir: string): Promise<void>;
}
