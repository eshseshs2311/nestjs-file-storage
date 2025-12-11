import { Global, Module } from "@nestjs/common";
import { FileService } from "./service/file.service";

@Global()
@Module({
  providers: [FileService],
  exports: [FileService],
})
export class UploadModule {}
