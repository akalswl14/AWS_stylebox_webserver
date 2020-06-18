var AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})
var docClient = new AWS.DynamoDB.DocumentClient();
var GetTodayData = require('./GetTodayData');

var UpdateData = {
    update_reviewstatus: async function (req, res) {
        BrandIDList = req.body.chkbox;
        if (typeof (BrandIDList) === 'string') {
            BrandIDList = [BrandIDList];
        }
        var inputData = []
        for (i = 0; i < BrandIDList.length; i++) {
            var tmp = {
                "brandID": parseInt(BrandIDList[i])
            }
            inputData.push(tmp);
        }
        var dbData = await getBrandInfoTable(inputData);
        dbData = dbData.Responses.BrandInfo;
        for (i = 0; i < BrandIDList.length; i++) {
            var CurrentStatus = dbData[i].ReviewStatus;
            if (CurrentStatus == "Y") {
                await update_review_BrandInfoTable(dbData[i].brandID, "N");
            } else {
                await update_review_BrandInfoTable(dbData[i].brandID, "Y");
            }
        }
        await UpdateCrawlingFeed(BrandIDList);
        GetTodayData.renderdata(req, res);
    },
    update_comments: async function (req, res) {
        input_comments = req.body.input_comments;
        BrandIDList = req.body.chkbox;
        if (typeof (BrandIDList) === 'string') {
            BrandIDList = [BrandIDList];
        }
        for (i = 0; i < BrandIDList.length; i++) {
            await update_comment_BrandInfoTable(parseInt(BrandIDList[i]), input_comments);
        }
        GetTodayData.renderdata(req, res);
    },
    delete_brand: async function (req, res) {
        BrandIDList = req.body.chkbox;

        if (typeof (BrandIDList) === 'string') {
            BrandIDList = [BrandIDList];
        }
        var inputData1 = []
        var inputData2 = []

        for (i = 0; i < BrandIDList.length; i++) {
            var tmp = {
                DeleteRequest: {
                    Key: {
                        "brandID": parseInt(BrandIDList[i])
                    }
                }
            }
            inputData1.push(tmp);
            tmp = {
                "brandID": parseInt(BrandIDList[i])
            }
            inputData2.push(tmp);
        }
        var dbData = await getBrandInfoTable(inputData2);
        dbData = dbData.Responses.BrandInfo;
        await deleteBrandInfoTable(inputData1);
        inputData2 = [];
        for (i = 0; i < BrandIDList.length; i++) {
            var tmp = {
                DeleteRequest: {
                    Key: {
                        "brandName": dbData[i].brandName
                    }
                }
            }
        }
        inputData2.push(tmp);
        await deleteBrandTable(inputData2);
        GetTodayData.renderdata(req, res);
    }
};
async function getBrandInfoTable(KeysData) {
    try {
        var params = {
            RequestItems: {
                "BrandInfo": {
                    Keys: KeysData
                }
            }
        };
        let data = await docClient.batchGet(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function update_review_BrandInfoTable(brandID, status) {
    try {
        var params = {
            TableName: 'BrandInfo',
            Key: {
                "brandID": brandID
            },
            UpdateExpression: 'set ReviewStatus = :rs',
            ExpressionAttributeValues: {
                ':rs': status
            }
        };
        let data = await docClient.update(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function update_comment_BrandInfoTable(brandID, comment) {
    try {
        var params = {
            TableName: 'BrandInfo',
            Key: {
                "brandID": brandID
            },
            ExpressionAttributeNames: {
                "#CM": "Comment",
            },
            UpdateExpression: 'set #CM = :c',
            ExpressionAttributeValues: {
                ':c': comment
            }
        };
        let data = await docClient.update(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function updateCrawlingFeedTable(FeedID) {
    try {
        var params = {
            TableName: 'CrawlingFeed',
            Key: {
                "FeedID": FeedID
            },
            UpdateExpression: 'set Check = :c',
            ExpressionAttributeValues: {
                ':c': true
            }
        };
        let data = await docClient.update(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function scanCrawlingFeedTable(brandID) {
    try {
        var params = {
            TableName: 'CrawlingFeed',
            FilterExpression: 'brandID = :bID',
            ExpressionAttributeValues: { ':bID': brandID }
        };
        let data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function deleteBrandInfoTable(inputData) {
    try {
        var params = {
            RequestItems: {
                "BrandInfo": inputData
            }
        };
        let data = await docClient.batchWrite(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function deleteBrandTable(inputData) {
    try {
        var params = {
            RequestItems: {
                "Brand": inputData
            }
        };
        let data = await docClient.batchWrite(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function UpdateCrawlingFeed(BrandIDList) {
    console.log('UpdateCrawlingFeed')
    var FeedInfoList = []
    for (var i = 0; i < BrandIDList.length; i++) {
        var dbData = await scanCrawlingFeedTable(BrandIDList[i]);
        FeedInfoList = FeedInfoList.concat(dbData.Items);
    }
    for (var i = 0; i < FeedInfoList.length; i++) {
        await updateCrawlingFeedTable(FeedInfoList[i]);
    }
};
module.exports = UpdateData;