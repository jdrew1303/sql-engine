var expect = require('chai').expect,
    mysql = require('mysql2'),
    levelup = require('levelup'),
    rimraf = require('rimraf'),
    levelQuery = require('level-queryengine'),
    sqlDriver = require('./lib/sql-driver'),
    jsonqueryEngine = require('jsonquery-engine'),
    path = require('path');

var testData, db, dbPath = path.join(__dirname, 'data', 'testdb');
rimraf.sync(dbPath);
db = levelup(dbPath, { valueEncoding: 'json' });
db = levelQuery(db);
testData = [
  { name: 'Eugene', num: 42, awesome: true },
  { name: 'Susan', num: 43, awesome: true },
  { name: 'Edmund', num: 88, awesome: false }
];

function batchData() {
  return testData.map(function (data, i) {
    return {
      key: i,
      value: data,
      type: 'put'
    };
  });
}

var server;
var users = levelQuery(db.sublevel('users'));
users.query.use(jsonqueryEngine());
users.batch(batchData(), function () {
  server = sqlDriver(db, 3307, undefined, undefined);
});