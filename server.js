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

var log2postgres = function(userData) {
    var activityStatus = userData.isActive;
    var desc;
    if(activityStatus == true || userData.sdStatus == true) {
        if(activityStatus == true) {
            if(userData.sdStatus == true) {
                    desc = 'Access by both';
            } else {
                desc = 'Access By Server';
            }
        } else if (userData.sdStatus) {
            desc = 'Denied by Server, Access by SD';
        }
    }
    desc = (desc + ", card: " + userData.card);
    var memberID = (userData.memberid ? userData.memberid : 00000);
    var insert2labaccess = "INSERT INTO labaccess (memberid, description) VALUES (" + memberID + ", '" + desc + "')";
    pgClient.query(insert2labaccess, function(err, result) {
        if(err) {
            console.log("SQL Error - " + insert2labaccess, err);
        } else {
            console.log("Entry added to DB");
        }
    });
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
            var siteCode = card.substr(0,2);
            var cardId = card.substr(2, card.length);
            console.log('Card ID: ' + cardId + ', Site Code: ' + siteCode);
            // Check for Door Auth Code
            // Check postgres for nfc/rfid match
            pgClient.query("SELECT m.memberid as memberid, firstname, lastname, isactive, c.cardid from members m left join cards c on m.memberid = c.memberid where c.cardid = '" + card + "' OR c.cardid LIKE '%" + cardId + "'", function(err, result) {
                if(result.rowCount > 0) {
                    // Grab member Data
                    // Check for index of ??
                    var serverCard = result.rows[0].cardid;
                    if(serverCard.indexOf('??') == 1) {
                        // Replace the ?? with the site code
                        var newCard = serverCard.replace(/??/, siteCode);
                        console.log('Corrected Card: ' + newCard);
                    }
                    var userData = {};
                    userData.memberid = result.rows[0].memberid;
                    userData.fname = result.rows[0].firstname;
                    userData.lname = result.rows[0].lastname;
                    userData.isActive = result.rows[0].isactive;
                    userData.card = card;
                    userData.sdStatus = cardInfo.sdStatus;
                    sendResponseToDoor(userData);
                    log2postgres(userData);
                } else {
                    var userData = {};
                    userData.isActive = false;
                    userData.sdStatus = cardInfo.sdStatus;
                    userData.card = cardInfo.card;
                    sendResponseToDoor(userData);
                    log2postgres(userData);
                }
                clearData();
            });
        }
    });
});
