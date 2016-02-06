var Connection = require('tedious').Connection;
var config = {
    userName: 'CircleAdmin',
    password: 'Rosblaze123',
    server: 'circleapp.database.windows.net',
    // If you are on Microsoft Azure, you need this:
    options: {encrypt: true, database: 'circle_db'}
};
var connection = new Connection(config);
connection.on('connect', function(err) {
// If no error, then good to proceed.
    console.log("Connected");
    executeStatement();
    
});


var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

function executeStatement() {
    /*
    request = new Request("SELECT * FROM dbo.BlacklistTokens;", function(err) {
    if (err) {
        console.log(err);}
    });*/
    console.log(query);
    request = new Request("SELECT * FROM dbo.BlacklistTokens WHERE expireTime < DATEADD(MINUTE, -1, GETDATE())", function(err) {
    if (err) {
        console.log(err);}
    });
    
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
          if (column.value === null) {
            console.log('NULL');
          } else {
            result+= column.value + " ";
          }
        });
        console.log(result);
        result ="";
        process.exit()
    });

    request.on('done', function(rowCount, more) {
    console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}