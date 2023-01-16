const aws = require('aws-sdk')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const s3 = new aws.S3(
  {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
  }
)

const awsHandler = {
  addImg: async (user, story, file) => {
    try {
      const paramsList = {
        Bucket: 'blog-poc-image-bucket',
        Delimiter: '/',
        Prefix: `${user}/${story}/`
      }

      const dataList = await s3.listObjects(paramsList).promise()
      const dataLength = dataList.Contents.length + 1

      const params = {
        Bucket: 'blog-poc-image-bucket',
        Key: `${user}/${story}/${dataLength}`,
        Body: file.buffer,
        ContentType: file.mimetype
      }
      const data = await new aws.S3.ManagedUpload({ service: s3, params }).promise()
      return data.Location
    } catch (err) {
      throw new Error('upload failed')
    }
  },
  addAvatar: async (user, file) => {
    try {
      const params = {
        Bucket: 'blog-poc-image-bucket',
        Key: `${user}/avatar`,
        Body: file.buffer,
        ContentType: file.mimetype
      }
      const data = await new aws.S3.ManagedUpload({ service: s3, params }).promise()
      return data.Location
    } catch (err) {
      throw new Error('upload failed')
    }
  }
}

module.exports = awsHandler
