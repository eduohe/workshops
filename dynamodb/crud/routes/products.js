var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-west-2",
//   endpoint: "http://localhost:8000"
// });

var credentials = new AWS.SharedIniFileCredentials({
  profile: 'sandbox-workshop'
});
AWS.config.update({
  region: "us-west-2"
});
AWS.config.credentials = credentials;

TABLE_NAME = 'EduardoProducts'

/* GET products  */
router.get('/', function (req, res, next) {
  res.send('products');
});

router.get('/read', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME,
    Key: {
      "id": 1
    }
  };

  docClient.get(params, function (err, data) {
    if (err) {
      res.send('Unable to read item. Error:' + JSON.stringify(err, null, 2));
    } else {
      res.send('GetItem succeeded:' + JSON.stringify(data, null, 2));
    }
  });

});


module.exports = router;
