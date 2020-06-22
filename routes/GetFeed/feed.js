var AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})
// var tableName = 'Brand';
var docClient = new AWS.DynamoDB.DocumentClient();
var express = require('express');
var router = express.Router();

/**
* BaseUrl :/getfeed
*/

var CheckUpdate = require('./CheckUpdate');
var UpdateData = require('./UpdateData');
var SelectFeed = require('./SelectFeed');
var GetTodayData = require('./GetTodayData');

router.get('/', function (req, res) {
    GetTodayData.renderdata(req, res);
});

router.post('/', async function (req, res) {
    if (req.body.act_button == "view details") {
        console.log(req.body);
        if (typeof (req.body.chkbox) == 'string') {
            brandnum = 1;
            brandList = new Array(req.body.chkbox)
        } else {
            brandList = req.body.chkbox;
            brandnum = brandList.length;
        }
        queryData = ''
        for (i = 0; i < brandnum; i++) {
            queryData += 'brand[]=' + brandList[i];
            if (i < brandnum - 1) {
                queryData += '&'
            }
        }
        res.redirect('/getfeed/selectfeed?' + queryData);
    } else {
        let dbData = await checkLastUpdateDateTable();
        if (dbData.Item.crawlingstatus == true) {
            res.redirect('/');
        } else {
            if (req.body.act_button == "modify reviewstatus") {
                UpdateData.update_reviewstatus(req, res);
            } else if (req.body.act_button == "modify comments") {
                UpdateData.update_comments(req, res);
            } else if (req.body.act_button == "delete brand") {
                UpdateData.delete_brand(req, res);
            }
        }

    }
});
router.get('/selectfeed', function (req, res) {
    SelectFeed.getembed(req, res);
});

router.get('/crawlingstatus', function (req, res) {
    let dbData = await checkLastUpdateDateTable();
    if (dbData.Item.crawlingstatus == true) {
        res.send({ status: true });
    } else {
        res.send({ status: false });
    }
})

async function checkLastUpdateDateTable() {
    try {
        var params = {
            TableName: 'LastUpdateDate',
            Key: {
                'No': 1
            },
        };
        let data = await docClient.get(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;