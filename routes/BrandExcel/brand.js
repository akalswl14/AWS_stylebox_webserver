var express = require('express');
var router = express.Router();
var multer = require('multer');
const path = require("path");

let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "public/")
    },
    filename: function(req, file, callback){
        let extension = path.extname(file.originalname);
        callback(null, 'brand' + extension);
    }
});

let upload = multer({ storage: storage});

/**
* BaseUrl : /brandexcel
*/

var BrandExcel = require('./BrandExcel');

router.get('/',function(req,res){
    res.render('BrandExcel/BrandExcel.html');
});

router.post('/',upload.single('myfile'),function(req,res){
    BrandExcel.upload(req,res);
});

module.exports = router;