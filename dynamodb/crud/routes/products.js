var express = require('express');
var router = express.Router();

var AWS = require("aws-sdk");

// AWS.config.update({
//   region: "us-west-2",
//   endpoint: "http://localhost:8000"
// });

var credentials = new AWS.SharedIniFileCredentials({
  profile: 'default'
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


router.get('/create', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME,
    Item: {
      "id": 2,
      "category": 'Office',
      "name": 'Pencil',
      "price": 2.34
    }
  };

  docClient.put(params, function (err, data) {
    if (err) {
      res.send('Unable to add record' + '. Error :' + JSON.stringify(err, null, 2));
    } else {
      res.send('PutItem succeeded');
    }
  });

});

router.get('/delete', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME,
    Key: {
      "id": 1
    }
  };

  docClient.delete(params, function (err, data) {
    if (err) {
      res.send('Unable to delete item. Error:' + JSON.stringify(err, null, 2));
    } else {
      res.send('DeleteItem succeeded');
    }
  });

});

router.get('/update', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME,
    Item: {
      "id": 2,
      "category": 'Office',
      "name": 'Pencil',
      "price": 3.45
    }
  };

  // Same method as Create
  docClient.put(params, function (err, data) {
    if (err) {
      res.send('Unable to update record' + '. Error :' + JSON.stringify(err, null, 2));
    } else {
      res.send('PutItem succeeded');
    }
  });

});


router.get('/scan', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      res.send("Unable to query. Error:" + JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      data.Items.forEach(function (item) {
        res.send(item.id + ": " + item.name + ' ' + item.category);
      });
    }
  });

});


router.get('/query', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  var params = {
    TableName: TABLE_NAME,
    IndexName: "category-index",
    ExpressionAttributeValues: {
      ":category": "Office"
    },
    KeyConditionExpression: "category = :category"
  };

  docClient.query(params, function (err, data) {
    if (err) {
      res.send("Unable to query. Error:" + JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      res.send(data);
    }
  });

});


router.get('/mass_write', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  for (i = 0; i <= 100000; i++) {
    var params = {
      TableName: TABLE_NAME,
      Item: {
        "id": i,
        "category": 'Office',
        "name": 'Pencil',
        "price": i
      }
    };

    docClient.put(params, function (err, data) {
      if (err) {
        console.log(err);
      }
    });
  }

  res.send("Finished.");
});


router.get('/transaction', function (req, res, next) {
  var docClient = new AWS.DynamoDB.DocumentClient();

  const params = {
    TransactItems: [{
      Put: {
        TableName: TABLE_NAME,
        Item: {
          "id": 1,
          "category": 'Office',
          "name": 'Pencil',
          "price": 3.45
        }
      }
    }, {
      Put: {
        TableName: TABLE_NAME,
        Item: {
          "id": 2,
          "category": 'Office',
          "name": 'Pencil',
          "price": 4.56
        }
      }
    }]
  };

  docClient.transactWrite(params, function (err, data) {
    if (err) console.log(err);
    else console.log(data);
  });

  res.send("Finished.");
});

module.exports = router;
