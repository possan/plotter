var express = require('express');
var serialport = require('serialport');

var app = express();

var last_status = '';
var command_queue = [];

app.use(express.static(__dirname + '/public'));

// requests will never reach this route
app.post('/api/command', function (req, res) {
	console.log('Queueing command', req.query.queue);
	command_queue.push(req.query.queue);
	res.send('OK');
	queueDrain(200);
});

// requests will never reach this route
app.get('/api/status', function (req, res) {
	// console.log('Sending status');
	res.send(last_status);
});

app.listen(3000);

var com = null;
var open = false;

try {
	com = new serialport.SerialPort('/dev/tty.usbmodem1421', { baudrate: 9600, parser: serialport.parsers.readline("\n") });
} catch(e) {
	console.error(e);
}

if (com) {
	com.on("open", function () {
		console.log('Serial port opened');
		// com.write(new Buffer('C'));
		open = true;
		queueDrain(100);
	});

	com.on("data", function (data) {
		last_status = data.toString();
		console.log('got data', last_status);
		// if (data.toString().substring(0, 1) == 'K') { gotAck(); }
		queueDrain(10);
	});

	com.on("close", function (data) {
		open = false;
		console.log('Serial port closed');
	});
}

function drain() {
	var cmd = null;
	if (command_queue.length > 0) {
		cmd = command_queue[0]
		command_queue.splice(0, 1);
		console.log('Sending command', cmd);
		if (com) com.write(new Buffer(cmd +'\n'));
	}
}

var queueTimer = 0;

function queueDrain(d) {
	if (queueTimer) clearTimeout(queueTimer);
	queueTimer = setTimeout(drain.bind(this), d || 5);
}


