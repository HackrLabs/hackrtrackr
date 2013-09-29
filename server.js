var serial = require('serialport').SerialPort,
    pg = require('pg');

var sp = new serial("/dev/ttyUSB0", {
    baudrate: 57600
}); 

var pgConn = "postgres://hackertracker:hackallthethings@localhost/hackertracker";

var pgClient = new pg.Client(pgConn);

pgClient.connect(function(err) {
    if(err) {
        sp.write("Failure to connect to database");
        return console.error('Could not connect to postgres', err);
    } else {
        console.log('Connected to Postgres');
        sp.write("Connect to Postgres");
    }
});

// Check for connection 
var readData = "";

function clearData() {
    dataStringBuf = "";
    readData = "";
    cardData = "";
    cardBuf = "";
    card = "";
}

sp.on("open", function(){
    console.log("open");
    sp.on('data', function(data){
        var dataStringBuf = new String(data);
        if(dataStringBuf.indexOf("*") != 1) {
            readData += dataStringBuf;
        } else {
            readData += dataStringBuf;
        }

        if(readData.indexOf("*") != -1) {
            var cardData = readData.split(",");
            var cardBuf = cardData[4];
            var card = cardBuf.replace(/_/g, "");
            console.log("Card: " + card);
            // Check for Door Auth Code
            // Check postgres for nfc/rfid match
            pgClient.query("SELECT firstname, lastname from members m left join cards c on m.memberid = c.memberid where c.cardid = '" + card + "'", function(err, result) {
                if(result.rowCount > 0) {
                    // Grab member Data
                    var fname = result.rows[0].firstname;
                    var lname = result.rows[0].lastname;
                    console.log("Welcome " + fname + " " + lname + "!");
                } else {
                    console.log("This is not the lab you're looking for.")
                }
                clearData();
            });
        }
    });
});
