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

    // Get SDStatus
    var sdStatus = isInSD(cardData[0]);

    var cardInfo = {};
    cardInfo.card = card;
    cardInfo.sdStatus = sdStatus;
    return cardInfo;
}

var sendResponseToDoor = function(userData) {
    var activityStatus = userData.isActive;
    var dateString = new Date();
    dateString = dateString.toLocaleString();
    if(activityStatus === true || userData.sdStatus === true) {
        console.log("Welcome " + userData.fname + " " + userData.lname + " - " + dateString);
        sp.write('A');
    } else {
        console.log("Card: " + userData.card + ", Access Denied By Server - " + dateString);
        //sp.write('D');
    }

}

var isInSD = function(readData) {
    var sdStatus;
    if(readData.indexOf("2") == 1) {
        sdStatus = true;
    } else {
        sdStatus = false;
    }
    return sdStatus;
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
	if(readData.indexOf("?") != -1) {
            var cardInfo = getCardCode(readData);
            var card = cardInfo.card;
            // Check for Door Auth Code
            // Check postgres for nfc/rfid match
            pgClient.query("SELECT firstname, lastname, isactive from members m left join cards c on m.memberid = c.memberid where c.cardid = '" + card + "'", function(err, result) {
                if(result.rowCount > 0) {
                    // Grab member Data
                    var userData = {};
                    userData.fname = result.rows[0].firstname;
                    userData.lname = result.rows[0].lastname;
                    userData.isActive = result.rows[0].isactive;
                    userData.card = card;
                    userData.sdStatus = cardInfo.sdStatus;
                    sendResponseToDoor(userData);
                } else {
                    sendResponseToDoor({isActive: false, sdStatus: cardInfo.sdStatus, card: cardInfo.card});
                }
                clearData();
            });
        }
    });
});
