const AWS = require('aws-sdk');
const stream = require('stream');


const s3Client = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const uploadParams = {
    Bucket: process.env.Bucket,
    // Key: 'user', // pass key
    Key: '', // pass key
    Body: null, // pass file body
};

// const rename = ()

const upload = {
    uploadImage: (req, res, next) => {
        const client = s3Client;
        const params = uploadParams;
        
        params.Key = req.file.originalname;
        params.Body = req.file.buffer;
            
        client.upload(params, (err, data) => {
        	if (err) {
        		res.status(500).json({error:"Error -> " + err});
        	}
            console.log(data);
        	next();
        });
    },
    uploadProductImage: (req, res, next) => {
        const client = s3Client;
        const params = uploadParams;
        
        params.Key = req.file.originalname;
        params.Body = req.file.buffer;
            
        client.upload(params, (err, data) => {
        	if (err) {
        		res.status(500).json({error:"Error -> " + err});
        	}
        	res.json('Product Image uploaded successfully');
        });
    },
    uploadBannerImage: (req, res, next) => {
        const client = s3Client;
        const params = uploadParams;
        
        params.Key = req.file.originalname;
        params.Body = req.file.buffer;
            
        client.upload(params, (err, data) => {
        	if (err) {
        		res.status(500).json({error:"Error -> " + err});
        	}
            console.log(data);
        	next();
        });
    }
}


module.exports = upload;