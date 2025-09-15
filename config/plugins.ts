export default ({ env }) => {
  // Debug logging
  console.log("[Upload Config] AWS_CDN:", env("AWS_CDN") ? "Set" : "Not set");
  console.log(
    "[Upload Config] AWS_ACCESS_KEY_ID:",
    env("AWS_ACCESS_KEY_ID") ? "Set" : "Not set",
  );
  console.log(
    "[Upload Config] AWS_BUCKET:",
    env("AWS_BUCKET") ? "Set" : "Not set",
  );
  console.log(
    "[Upload Config] AWS_REGION:",
    env("AWS_REGION") ? "Set" : "Not set",
  );

  return {
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
          baseUrl: env("AWS_CDN"),
          s3Options: {
            credentials: {
              accessKeyId: env("AWS_ACCESS_KEY_ID"),
              secretAccessKey: env("AWS_ACCESS_SECRET"),
            },
            region: env("AWS_REGION"),
            params: {
              ACL: "private",
              signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
              Bucket: env("AWS_BUCKET"),
            },
          },
        },
      },
    },
  };
};
