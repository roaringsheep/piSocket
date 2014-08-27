var socket = require('socket.io-client')('http://192.168.1.60:9000/pi-socket');
// var gpio = require('pi-gpio');
// var piSocket = socket('http://localhost/pi-socket');

socket.on('connect',function(){
		console.log('connect successful!');
	socket.on('move', function(data){
		console.log('got move', data);
		var portArr = data.split(',');
		processPort(portArr, function() {
			console.log('done!');
		})
	});
	socket.on('disconnect',function(){
		console.log('disconnect successful!');
	})
})

[7, 11, 12, 13, 15, 16, 18, 22].forEach(function(portNum) {
    gpio.open(portNum, "output", function(err) {
        if (err) console.log("Error opening", portNum, err);
        console.log("Opened port", portNum);
    });
});

function processPort(portArray, callback) {
    var port = Number(portArray.shift());
    var onOff = portArray.shift();
    var onVal = onOff === "on" ? 1 : 0;
    console.log("Turning", port, "to status", onOff);
    gpio.write(port, onVal, function(err) {
        console.log("Error on write:", err);
        //               gpio.close(port);
        if (portArray.length > 1) {
            setTimeout(function() {
                processPort(portArray, callback);
            }, 50);
        } else {
            callback();
        }
    });
}
