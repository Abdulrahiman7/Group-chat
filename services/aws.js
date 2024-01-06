const Aws=require('aws-sdk');

exports.uploadToS3= (file, bucketName)=>
{
  const key=process.env.IAM_USER_KEY;
  const secret=process.env.IAM_USER_SECRET;
  const s3bucket=new Aws.S3({
    accessKeyId: key,
    secretAccessKey: secret,
  })

    var params={
      Bucket:bucketName,
      Key: file.name,
      Body: file.data,
      ACL: 'public-read'
    }
    return new Promise((resolve,reject)=>{
      s3bucket.upload(params, (err, s3res) =>{
        if(err){
          console.log(err);
          reject(err);
        }else{
          console.log('success', s3res);
          resolve(s3res.Location);
        }
      })
    })
}