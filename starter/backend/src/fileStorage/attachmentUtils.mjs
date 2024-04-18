import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

export class AttachmentFile {
  constructor(
    bucketName = process.env.IMAGES_TODO_S3_BUCKET,
    urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION),
    s3Client = new S3Client()
  ) {
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
    this.s3Client = s3Client
  }

  async generateUploadUrl(todoId) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: todoId
    })

    const presignedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.urlExpiration
    })
    return presignedUrl
  }
}
