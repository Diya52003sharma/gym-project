const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dv5ztycmt',
    api_key: '727845629729126',
    api_secret: 'VhkrB8TWyQhtZnCelMit1VZAl8s' // Click 'View API Keys' above to copy your API secret
});

const uploadImg = async (fileBuffer, publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId,
                resource_type: "auto"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};

module.exports = {
    uploadImg
};