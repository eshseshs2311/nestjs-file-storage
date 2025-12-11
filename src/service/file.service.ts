import { Injectable } from "@nestjs/common";
import { join } from "path";
import { promises as fs } from "fs";
import { randomUUID } from "crypto";

@Injectable()
export class FileService {
  private uploadDir: string;

  constructor(baseDir?: string) {
    this.uploadDir = join(process.cwd(), baseDir || "uploads");
  }

  /** Save a single file */
  async saveFile(file: Express.Multer.File, subDir = "temp"): Promise<string> {
    const dir = join(this.uploadDir, subDir);
    await fs.mkdir(dir, { recursive: true });

    const ext = file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${ext}`;
    const filepath = join(dir, filename);

    if (file.buffer) await fs.writeFile(filepath, file.buffer);
    else if (file.path) {
      const content = await fs.readFile(file.path);
      await fs.writeFile(filepath, content);
    } else throw new Error("File has no buffer or path");

    return `${subDir}/${filename}`;
  }

  /** Delete a single file */
  async deleteFile(relativePath: string) {
    const fullPath = join(this.uploadDir, relativePath);
    if (await fs.stat(fullPath).catch(() => false)) await fs.unlink(fullPath);
  }

  /** Bulk delete files */
  async deleteFiles(paths: string[]) {
    await Promise.all(paths.map((p) => this.deleteFile(p)));
  }

  /** Replace a single file */
  async replaceFile(
    oldPath: string,
    newFile: Express.Multer.File,
    subDir?: string
  ): Promise<string> {
    if (oldPath) await this.deleteFile(oldPath);
    return this.saveFile(newFile, subDir);
  }

  /** Bulk replace files */
  async replaceFiles(
    oldPaths: string[],
    newFiles: Express.Multer.File[],
    subDir?: string
  ): Promise<string[]> {
    const results: string[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const saved = await this.replaceFile(oldPaths[i], newFiles[i], subDir);
      results.push(saved);
    }
    return results;
  }

  /** Move a single file */
  async moveFile(currentPath: string, newSubDir: string): Promise<string> {
    const oldFull = join(this.uploadDir, currentPath);
    const filename = currentPath.split("/").pop();
    const newDir = join(this.uploadDir, newSubDir);
    await fs.mkdir(newDir, { recursive: true });
    const newFull = join(newDir, filename!);
    await fs.rename(oldFull, newFull);
    return `${newSubDir}/${filename}`;
  }

  /** Move multiple files */
  async moveFiles(paths: string[], newSubDir: string): Promise<string[]> {
    const newDir = join(this.uploadDir, newSubDir);
    await fs.mkdir(newDir, { recursive: true });
    const results = await Promise.all(
      paths.map(async (currentPath) => {
        const filename = currentPath.split("/").pop();
        const oldFull = join(this.uploadDir, currentPath);
        const newFull = join(newDir, filename!);
        await fs.rename(oldFull, newFull);
        return `${newSubDir}/${filename}`;
      })
    );
    return results;
  }

  /** Delete entire folder */
  async deleteFolder(subDir: string) {
    const dir = join(this.uploadDir, subDir);
    if (await fs.stat(dir).catch(() => false))
      await fs.rm(dir, { recursive: true, force: true });
  }
}
