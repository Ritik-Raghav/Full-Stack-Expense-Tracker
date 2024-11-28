const sequelize = require('../util/database');
const User = require('../models/user');
const Files = require('../models/files');
const Expense = require('../models/expense');
const AWS = require('aws-sdk');

exports.uploadFiles = async (req, res, next) => {
    try {
        const fileURL = req.body.fileInfo.Location;
        const key = req.body.fileInfo.key;
        console.log(fileURL.key)
        const user = req.user;
        const newFile = await user.createFile({
            fileURL,
            key
        });
        res.status(201).json(newFile);
    }
    catch(error) {
        console.log(error);
    }
}

exports.downloadFiles = async (req, res, next) => {
    try {
        const user = req.user;
        const allFiles = await user.getFiles();
        res.status(200).json(allFiles);
    }
    catch(error) {
        console.log(error);
    }
}

exports.getUserLeaderboard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });
        
        res.status(200).json(userLeaderBoardDetails);
    }
    catch(error) {
        console.log(error);
    }
}

function uploadToS3(data, filename) {
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        })

    
        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }
        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if (err) {
                    console.log('Something went wrong', err);
                    reject(err);
                }
                else {
                    console.log('success', s3response);
                    resolve(s3response);
                }
            })
        })
        
}

exports.downloadExpenses = async (req, res, next) => {
    try {
        const expenses = await req.user.getExpenses();
        const stringifiedExpenses = JSON.stringify(expenses);

        const userId = req.user.id;
        const filename = `Expense${userId}/${new Date()}.txt`;
        const obj = await uploadToS3(stringifiedExpenses, filename);
        res.status(200).json({ obj, success: true});
    }
    catch(error) {
        console.log(error);
        res.status(500).json({fileURL: '', success: false, error: error});
    }
}
