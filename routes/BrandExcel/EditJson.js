var AWS = require('aws-sdk');
AWS.config.update({
    region: 'ap-southeast-1'
})
// var tableName = 'Brand';
var docClient = new AWS.DynamoDB.DocumentClient();
var EditJson = {
    edit_brandexcel: async function (ExcelJsonData, res) {
        SheetData = ExcelJsonData["StyleBOX Brand"]
        for (i in SheetData) {
            element = SheetData[i];
            var BrandName = element.Name;
            BrandName = BrandName.replace(/ /gi, '_');
            BrandName = BrandName.replace(" ", "");
            var FollowerNum = element[" Followers "];
            var instaID = element.Insta;
            if (BrandName == undefined || instaID == undefined) {
                continue;
            }
            // BrandName으로 <Brand> 테이블 조회. true면 있고, false 면 없음.
            let data = await checkBrandTable(BrandName);
            if(Object.keys(data).length > 0){
                continue;
            }
            var tmpidx = instaID.indexOf('instagram.com/') + 14;
            instaID = instaID.substring(tmpidx).split('/')[0];
            var BrandID = "";
            var BrandSite = "";
            var BrandText = "";
            if (element.site != undefined) {
                BrandSite = element.site;
            }
            if (element.Text != undefined) {
                BrandText = element.Text;
            }
            var AddressList = []
            for (i = 1; i <= 10; i++) {
                tmpKey = 'address ' + String(i)
                if (element[tmpKey] == undefined) {
                    AddressList.push("");
                } else {
                    AddressList.push(element[tmpKey]);
                }
            }
            // <Brand> 테이블에 브랜드가 몇개 있는지 확인.
            data = await sizeBrandTable();
            var BrandSize = data.Count;
            BrandID = BrandSize + 1;
            var tmp = {};
            tmp["brandID"] = BrandID;
            tmp["brandName"] = BrandName;
            tmp["instaID"] = instaID;
            // <Brand> 테이블에 저장
            await putTable('Brand', tmp);
            tmp["FollowerNum"] = FollowerNum;
            tmp["Site"] = BrandSite;
            tmp["Text"] = BrandText;
            tmp["FeedNum"] = 0;
            tmp["UpdateFeedNum"] = 0;
            tmp["NewFeedNum"] = 0;
            tmp["TodayDownloadNum"] = 0;
            tmp["DownloadNum"] = 0;
            tmp["ReviewStatus"] = "N";
            tmp["Comment"] = "";
            tmp["Address"] = AddressList;
            //<BrandInfo> 테이블에 저장
            await putTable('BrandInfo', tmp);
        }
        res.redirect('/');
    }
}
async function checkBrandTable(brandName) {
    try {
        var params = {
            TableName: 'Brand',
            Key: {
                'brandName': brandName
            },
        };
        let data = await docClient.get(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function sizeBrandTable() {
    try {
        var params = {
            TableName: 'Brand',
            Select: 'COUNT'
        };
        let data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        console.log(err);
    }
}
async function putTable(tableName, inputData) {
    try {
        var params = {
            TableName: tableName,
            Item: inputData
        };
        let data = await docClient.put(params).promise();
        return;
    } catch (err) {
        console.log("putTable");
        console.log(err);
    }
}
module.exports = EditJson;