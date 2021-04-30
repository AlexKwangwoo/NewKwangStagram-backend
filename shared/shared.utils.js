import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

export const uploadToS3 = async (file, userId, folderName) => {
  const { filename, createReadStream } = await file;
  console.log("file", file);

  const readStream = createReadStream();
  const objectName = `${folderName}/${userId}-${Date.now()}-${filename}`;
  //folderName/ 이름을추가해줌으로써 AWS S3에 폴더별로 사진이 묶임!
  const { Location } = await new AWS.S3()
    //파일업로드하면 location을 담아서 보내준다! 그게 url이 될것임
    .upload({
      Bucket: "newkwangstagram",
      Key: objectName,
      //objectName : 고유한 파일이름이될것임.. 파일이름이 중복되면 안되기에
      ACL: "public-read",
      Body: readStream,
      //Body는 파일을 말함
      //바이너리형식일수도있고 스트림형식일수도있음.. 방법은많음
    })
    .promise();
  return Location;
};

// 사진지울때 S3에서도 같이 지우고싶다면..
// export const deleteInS3 = async (fileUrl) => {
//   const Key = fileUrl.replace(
//   'https://버킷이름.s3.amazonaws.com/',
//   ''
//   );
//   await S3.deleteObject({
//   Bucket,
//   Key,
//   }).promise();
//   };
