export default ({ env }) => ({
  documentation: { enabled: true },
  "color-picker": {
    enabled: true,
  },
  superfields: {
    enabled: true,
  },
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        accessKeyId: env("AWS_ACCESS_KEY_ID"),
        secretAccessKey: env("AWS_ACCESS_SECRET"),
        region: env("AWS_REGION"),
        baseUrl: env("AWS_CDN"),
        params: {
          ACL: "private",
          signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
          Bucket: env("AWS_BUCKET"),
        },
      },
    },
  },
});