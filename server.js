var serialport = require('serialport'),
    serial = serialport.SerialPort,
    pg = require('pg');

var sp = new serial("/dev/ttyUSB0", 
{ baudrate: 57600
, parser: serialport.parsers.readline("\n")
, buffersize: 100
});



var pgConn = "postgres://hackertracker:hackallthethings@localhost/hackertracker";

var pgClient = new pg.Client(pgConn);

pgClient.connect(function(err) {
    if(err) {
        sp.write("Failure to connect to database");
        return console.error('Could not connect to postgres', err);
    } else {
        console.log('Connected to Postgres');
        sp.write("Connected to Postgres");
    }
});

// Check for connection 
var readData = "";

var clearData = function() {
    dataStringBuf = "";
    readData = "";
    cardData = "";
    cardBuf = "";
    card = "";
}

var getCardCode = function(readData) {
    var cardData = readData.split(",");
    var arrLen = cardData.length;
    arrLen -= 2;
    var cardBuf = cardData[arrLen];
    var card = cardBuf.replace(/_/g, "");
    return card;
}

var sendResponseToDoor = function(activityStatus) {
    if(isActive === true) {
        console.log("Welcome " + fname + " " + lname + "!");
        sp.write('A');
    } else {
        console.log("Access Denied!");
        sp.write('R');
    }

}

sp.on("open", function(){
    console.log("open");
    sp.on('data', function(data){
        clearData();
        var dataStringBuf = new String(data);
        if(dataStringBuf.indexOf("@") == 1) {
	    readData = dataStringBuf;
        } else if(dataStringBuf.indexOf("*") != 1) {
            readData += dataStringBuf;
       	} else {
            readData += dataStringBuf;
        }
        
	// If the full buffer is set check the database.
	if(readData.indexOf("*") != -1) {
            var card = getCardCode(readData);
            // Check for Door Auth Code
            // Check postgres for nfc/rfid match
            pgClient.query("SELECT firstname, lastname, isactive from members m left join cards c on m.memberid = c.memberid where c.cardid = '" + card + "'", function(err, result) {
                if(result.rowCount > 0) {
                    // Grab member Data
                    var fname = result.rows[0].firstname;
                    var lname = result.rows[0].lastname;
                    var isActive = result.rows[0].isactive;
                    sendResponseToDoor(isActive);
                } else {
                    sendResponseToDoor(false);
                }
                clearData();
            });
        }
    });
});
