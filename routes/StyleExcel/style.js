var express = require('express');
var router = express.Router();

/**
* BaseUrl :/styleexcel
*/


router.get('/',function(req,res){
    res.render('StyleExcel/StyleExcel.html');
});

router.post('/',function(req,res){
    res.redirect('/');
});

module.exports = router;