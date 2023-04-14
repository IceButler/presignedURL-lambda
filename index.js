const dotenv = require("dotenv");
const AWS = require("aws-sdk");
dotenv.config();

const s3Client = new AWS.S3({
  region: "ap-northeast-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

exports.handler = async (event, context, callback) => {
  const { ext, dir } = event;
  const imageDir = getImageDir(dir);

  let today = new Date();
  let randomStr = Math.random().toString(36).substring(2, 8);
  let imageKey = today.getTime() + randomStr;

  const params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: `${imageDir}${imageKey}.${ext}`,
    Expires: 60 * 60,
  };

  // id: params.Key,
  // presignedUrl: presignedUrl,

  const presignedUrl = await s3Client.getSignedUrlPromise("putObject", params);
  callback(null, {
    imageKey: imageKey + "." + ext,
    presignedUrl: presignedUrl,
  });
};

function getImageDir(imageDir) {
  if (imageDir === "recipe-thumbnail") return "recipe-thumbnail/";
  else if (imageDir === "recipe-image") return "recipe-image/";
  else if (imageDir === "profile") return "profile/";
}
