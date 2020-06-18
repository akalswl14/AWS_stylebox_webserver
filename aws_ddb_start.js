var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})
const dynamodb = new AWS.DynamoDB();
var tableName = 'BrandInfo';
var docClient = new AWS.DynamoDB.DocumentClient();
var ParseObj = JSON.parse(fs.readFileSync('public/json/brand.json', 'utf8'));
var KeyList = Object.keys(ParseObj);
var cnt = 0;
KeyList.forEach(function (EachKey) {
    cnt++;
    var eachitem = ParseObj[EachKey];
    var params = {
        TableName: tableName,
        Item: {
            brandID: cnt,
            brandName: EachKey,
            instaID: eachitem.instaID,
            FollowerNum: eachitem.FollowerNum,
            Site: eachitem.Site,
            Text: eachitem.Text,
            Address: eachitem.Address,
            FeedNum: eachitem.FeedNum,
            UpdateFeedNum: eachitem.UpdateFeedNum,
            NewFeedNum: eachitem.NewFeedNum,
            TodayDownloadNum: eachitem.TodayDownloadNum,
            DownloadNum: eachitem.DownloadNum,
            ReviewStatus: eachitem.ReviewStatus,
            Comment: eachitem.Comment
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });
});