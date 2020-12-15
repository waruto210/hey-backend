import { Injectable } from '@nestjs/common';
import * as nuid from 'nuid';
import Minio = require('minio');

@Injectable()
export class AppService {
  private minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: Number(process.env.MINPORT),
    useSSL: false,
    accessKey: process.env.ACCESS,
    secretKey: process.env.SECRET,
  });
  async upload(file) {
    if (!(await this.minioClient.bucketExists(process.env.BUCKET))) {
      await this.minioClient.makeBucket(process.env.BUCKET, 'cn-north-1');
    }
    const filename = `${nuid.next()}.${file.mimetype.split('/')[1]}`;
    const metaData = { 'Content-Type': file.mimetype };
    await this.minioClient.putObject(
      process.env.BUCKET,
      filename,
      file.buffer,
      metaData,
    );
    const url =
      'http://' +
      process.env.ENDPOINT +
      ':' +
      process.env.MINPORT +
      '/' +
      process.env.BUCKET +
      '/' +
      filename;
    return { picture: url };
  }
}
