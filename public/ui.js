
$(document.body).ready(function() {

	var defaults = {
		m1x: 40,
		m1y: 60,
		m1drop: 90,

		m1tl: 15,
		m1tr: 37,
		m1bl: 34,
		m1br: 47,
		m1origin: 100,
		m1realdrop: 300,

		m2x: 80,
		m2y: 40,
		m2drop: 110,
		m2origin: 200,
		m2realdrop: 600,

		m2tl: 30,
		m2tr: 17,
		m2bl: 43,
		m2br: 42,

		width: 210,
		heigth: 297
	};

	var config = {};

	function saveConfig() {
		console.log('saving config', config);
		localStorage.setItem('config', JSON.stringify(config))
	}

	function loadConfig() {
		var stored = {};
		try {
			stored = JSON.parse(localStorage.getItem('config'));
		} catch(e) {
		}
		for(var k in defaults) {
			config[k] = parseFloat('' + defaults[k]);
		}
		for(var k in stored) {
			config[k] = parseFloat('' + stored[k]);
		}
		console.log('loaded config', config);
	}

	function bindConfigFields() {
		$('#motor1tl').val(config.m1tl);
		$('#motor1tr').val(config.m1tr);
		$('#motor1bl').val(config.m1bl);
		$('#motor1br').val(config.m1br);
		$('#motor2tl').val(config.m2tl);
		$('#motor2tr').val(config.m2tr);
		$('#motor2bl').val(config.m2bl);
		$('#motor2br').val(config.m2br);
		$('#motor1x').val(config.m1x);
		$('#motor1y').val(config.m1y);
		$('#motor1drop').val(config.m1drop);
		$('#motor1origin').val(config.m1origin);
		$('#motor1realdrop').val(config.m1realdrop);
		$('#motor2x').val(config.m2x);
		$('#motor2y').val(config.m2y);
		$('#motor2drop').val(config.m2drop);
		$('#motor2origin').val(config.m2origin);
		$('#motor2realdrop').val(config.m2realdrop);
	}

	function calcConfigs() {

		console.log('m1 tc', config.m1origin);
		console.log('m2 tc', config.m2origin);

		config.m1tl = -config.m1origin;
		config.m1tr = config.m1origin;

		config.m1bl = config.m1origin + config.m1realdrop;
		config.m1br = (config.m1origin + config.m1realdrop) * 1.3;

		config.m2tl = config.m2origin;
		config.m2tr = -config.m2origin;

		config.m2bl = (config.m2origin + config.m2realdrop) * 1.3;
		config.m2br = config.m2origin + config.m2realdrop;

		console.log('m1 tl', config.m1tl);
		console.log('m1 tr', config.m1tr);
		console.log('m1 bl', config.m1bl);
		console.log('m1 br', config.m1br);
		console.log('m1 c');

		console.log('m2 tl', config.m2tl);
		console.log('m2 tr', config.m2tr);
		console.log('m2 bl', config.m2bl);
		console.log('m2 br', config.m2br);
		console.log('m2 c');

	}

	function saveConfigFields() {
		config.m1tl = parseFloat($('#motor1tl').val());
		config.m1tr = parseFloat($('#motor1tr').val());
		config.m1bl = parseFloat($('#motor1bl').val());
		config.m1br = parseFloat($('#motor1br').val());
		config.m2tl = parseFloat($('#motor2tl').val());
		config.m2tr = parseFloat($('#motor2tr').val());
		config.m2bl = parseFloat($('#motor2bl').val());
		config.m2br = parseFloat($('#motor2br').val());
		config.m1x = parseFloat($('#motor1x').val());
		config.m1y = parseFloat($('#motor1y').val());
		config.m1drop = parseFloat($('#motor1drop').val());
		config.m1origin = parseFloat($('#motor1origin').val());
		config.m1realdrop = parseFloat($('#motor1realdrop').val());
		config.m2x = parseFloat($('#motor2x').val());
		config.m2y = parseFloat($('#motor2y').val());
		config.m2drop = parseFloat($('#motor2drop').val());
		config.m2origin = parseFloat($('#motor2origin').val());
		config.m2realdrop = parseFloat($('#motor2realdrop').val());
		calcConfigs();
		saveConfig();
		drawLengths();
	}

	$('#motor1tl').change(saveConfigFields);
	$('#motor1tr').change(saveConfigFields);
	$('#motor1bl').change(saveConfigFields);
	$('#motor1br').change(saveConfigFields);
	$('#motor2tl').change(saveConfigFields);
	$('#motor2tr').change(saveConfigFields);
	$('#motor2bl').change(saveConfigFields);
	$('#motor2br').change(saveConfigFields);
	$('#motor1x').change(saveConfigFields);
	$('#motor1y').change(saveConfigFields);
	$('#motor1drop').change(saveConfigFields);
	$('#motor1origin').change(saveConfigFields);
	$('#motor1realdrop').change(saveConfigFields);
	$('#motor2x').change(saveConfigFields);
	$('#motor2y').change(saveConfigFields);
	$('#motor2drop').change(saveConfigFields);
	$('#motor2origin').change(saveConfigFields);
	$('#motor2realdrop').change(saveConfigFields);

	loadConfig();
	calcConfigs();
	bindConfigFields();

	console.log('ready.');

	function queueCommand(cmd) {
		console.log('Queue command', cmd);
		$.post('/api/command?queue=' + encodeURIComponent(cmd), function(r) {
			console.log(r);
			queuePoll();
		});
	}

	function poll() {
		$.get('/api/status', function(r) {
			// 	console.log(r);
			if(r) {
				$('#status').text(r);
			}
			queuePoll();
		});
	}

	var queueTimer = 0;

	function queuePoll() {
		if (queueTimer) clearTimeout(queueTimer);
		queueTimer = setTimeout(poll.bind(this), 1000);
	}

	$('#reset').click(function() { queueCommand('R'); });

	$('#pen0').click(function() { queueCommand('P,0'); });
	$('#pen1').click(function() { queueCommand('P,1'); });

	$('#motor1back100').click(function() { queueCommand('T,0,-100'); });
	$('#motor1back10').click(function() { queueCommand('T,0,-10'); });
	$('#motor1back1').click(function() { queueCommand('T,0,-1'); });
	$('#motor1fwd1').click(function() { queueCommand('T,0,1'); });
	$('#motor1fwd10').click(function() { queueCommand('T,0,10'); });
	$('#motor1fwd100').click(function() { queueCommand('T,0,100'); });

	$('#motor2back100').click(function() { queueCommand('T,1,-100'); });
	$('#motor2back10').click(function() { queueCommand('T,1,-10'); });
	$('#motor2back1').click(function() { queueCommand('T,1,-1'); });
	$('#motor2fwd1').click(function() { queueCommand('T,1,1'); });
	$('#motor2fwd10').click(function() { queueCommand('T,1,10'); });
	$('#motor2fwd100').click(function() { queueCommand('T,1,100'); });

	var linehistory = [];

	function calcLengths(x, y) {
		console.log('calcLengths', x, y);

		var dx1 = x - config.m1x;
		var dy1 = y - config.m1y;
		var d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);

		var dx2 = x - config.m2x;
		var dy2 = y - config.m2y;
		var d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

		return [d1, d2];
	}

	function calcLengthsFromBox(xp, yp) {



		var x = xp / 100.0;
		var y = yp / 100.0;
		x = Math.max(0.0, Math.min(1.0, x));
		y = Math.max(0.0, Math.min(1.0, y));
		var ix = 1.0 - x;
		var iy = 1.0 - y;
		var top_a = config.m1tl * ix + config.m1tr * x;
		var top_b = config.m2tl * ix + config.m2tr * x;
		var bot_a = config.m1bl * ix + config.m1br * x;
		var bot_b = config.m2bl * ix + config.m2br * x;
		var ctr_a = top_a * iy + bot_a * y;
		var ctr_b = top_b * iy + bot_b * y;
		return [ctr_a, ctr_b];
	}

	function calcDropPoint(ax, ay, r1, bx, by, r2) {
		// stolen from http://www.ambrsoft.com/TrigoCalc/Circles2/Circle2.htm
		var fv = [0,0,0,0];
		var D = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
		var p = Math.sqrt((D + r1 + r2) * (D + r1 - r2) * (D - r1 + r2) * (-D + r1 + r2)) / 4;
		var e1 = (ax + bx) / 2 + (bx - ax) * (r1 * r1 - r2 * r2) / (2 * D * D);
		var e2 = (ay + by) / 2 + (by - ay) * (r1 * r1 - r2 * r2) / (2 * D * D);
		var x1 = (e1 + 2 * (ay - by) * p / (D * D));
		var y1 = (e2 - 2 * (ax - bx) * p / (D * D));
		var x2 = (e1 - 2 * (ay - by) * p / (D * D));
		var y2 = (e2 + 2 * (ax - bx) * p / (D * D));
		// Intersection coordinates -----------------------------------------------
		fv[0] = e1 + 2 * (ay - by) * p / (D * D);
		fv[1] = e2 - 2 * (ax - bx) * p / (D * D);
		fv[2] = e1 - 2 * (ay - by) * p / (D * D);
		fv[3] = e2 + 2 * (ax - bx) * p / (D * D);
		if (fv[3] > fv[1]) {
			return [ fv[2], fv[3] ];
		} else {
			return [ fv[0], fv[1] ];
		}
	}

	function drawLengths(lengths) {
		// var l = calcLengths(x, y);
		console.log('drawLengths', lengths);

		var ctx = $('#canvas1')[0].getContext('2d');
		var ctx2 = $('#canvas2')[0].getContext('2d');
		ctx.fillRect(0,0,200,200);
		ctx2.fillRect(0,0,200,200);

		ctx.strokeStyle = '#f40';
		ctx.beginPath();
		// ctx.moveTo(m1x, m1y);
		// ctx.lineTo(x, y);
		ctx.stroke();
		if (lengths && lengths[0] > 0) {
			ctx.beginPath();
			ctx.arc(config.m1x, config.m1y, lengths[0], 0, Math.PI*2, false);
			ctx.stroke();
		}

		ctx.strokeStyle = '#2f0';
		ctx.beginPath();
		// ctx.moveTo(m2x, m2y);
		// ctx.lineTo(x, y);
		ctx.stroke();
		if (lengths && lengths[1] > 0) {
			ctx.beginPath();
			ctx.arc(config.m2x, config.m2y, lengths[1], 0, Math.PI*2, false);
			ctx.stroke();
		}

		ctx.strokeStyle = '#fff';
		ctx.beginPath();
		ctx.arc(config.m2x, config.m2y, 5, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(config.m2x, config.m2y + config.m2drop, 5, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(config.m1x, config.m1y, 5, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(config.m1x, config.m1y + config.m1drop, 5, 0, Math.PI*2, false);
		ctx.stroke();

		ctx.strokeStyle = '#fff';
		ctx.beginPath();
		ctx.arc(config.m1x, config.m1y, 5, 0, Math.PI*2, false);
		ctx.stroke();

		var cle1 = calcLengthsFromBox(0, 0);
		var cle2 = calcLengthsFromBox(100, 0);
		var cle3 = calcLengthsFromBox(100, 100);
		var cle4 = calcLengthsFromBox(0, 100);

		var cpt1 = calcDropPoint(config.m1x, config.m1y, cle1[0], config.m2x, config.m2y, cle1[1]);
		var cpt2 = calcDropPoint(config.m1x, config.m1y, cle2[0], config.m2x, config.m2y, cle2[1]);
		var cpt3 = calcDropPoint(config.m1x, config.m1y, cle3[0], config.m2x, config.m2y, cle3[1]);
		var cpt4 = calcDropPoint(config.m1x, config.m1y, cle4[0], config.m2x, config.m2y, cle4[1]);

		ctx.strokeStyle = '#777';
		ctx.beginPath();
		ctx.moveTo(cpt1[0], cpt1[1]);
		ctx.lineTo(cpt2[0], cpt2[1]);
		ctx.lineTo(cpt3[0], cpt3[1]);
		ctx.lineTo(cpt4[0], cpt4[1]);
		ctx.lineTo(cpt1[0], cpt1[1]);
		ctx.stroke();


		for(var i=0; i<linehistory.length; i++) {
			var line = linehistory[i];
			console.log('draw line', line);

			var le1 = calcLengthsFromBox(line.x1, line.y1);
			console.log('le1', le1);
			var pt1 = calcDropPoint(config.m1x, config.m1y, le1[0], config.m2x, config.m2y, le1[1]);
			console.log('pt1', pt1);

			var le2 = calcLengthsFromBox(line.x2, line.y2);
			console.log('le2', le2);
			var pt2 = calcDropPoint(config.m1x, config.m1y, le2[0], config.m2x, config.m2y, le2[1]);
			console.log('pt2', pt2);

			ctx.strokeStyle = '#ff0';
			ctx.beginPath();
			ctx.moveTo(pt1[0], pt1[1]);
			ctx.lineTo(pt2[0], pt2[1]);
			ctx.stroke();

			ctx2.strokeStyle = '#f0f';
			ctx2.beginPath();
			ctx2.moveTo(line.x1 * 2, line.y1 * 2);
			ctx2.lineTo(line.x2 * 2, line.y2 * 2);
			ctx2.stroke();
		}

		if (lengths && lengths[0] > 0 && lengths[1] > 0) {
			var pt = calcDropPoint(config.m1x, config.m1y, lengths[0], config.m2x, config.m2y, lengths[1]);
			ctx.strokeStyle = '#8cf';
			ctx.beginPath();
			ctx.arc(pt[0], pt[1], 10, 0, Math.PI*2, false);
			ctx.stroke();
		}

		var m1realdrop = [ config.m1tl, config.m1bl ];
		var m2realdrop = [ config.m2tr, config.m2br ];

		$('#motor1realdrop').text( m1realdrop[0] + ' to ' + m1realdrop[1] );
		$('#motor2realdrop').text( m2realdrop[0] + ' to ' + m2realdrop[1] );
	}

	$('#canvas1').on('mousemove', function(e) {
		console.log('move at', e.offsetX, e.offsetY);
		lengths = calcLengths(e.offsetX, e.offsetY);
		drawLengths(lengths);
	});

	$('#canvas2').on('mousemove', function(e) {
		console.log('move at', e.offsetX, e.offsetY);
		// calc lengths from mapped surface
		lengths = calcLengthsFromBox(e.offsetX / 2, e.offsetY / 2);
		drawLengths(lengths);
	});

	var lx = 0;
	var ly = 0;

	$('#canvas2').on('mousedown', function(e) {
		console.log('mousedown at', e.offsetX, e.offsetY);
		lx = e.offsetX / 2;
		ly = e.offsetY / 2;
	});

	function queueLine(x1,y1,x2,y2) {
		var l1 = calcLengthsFromBox(x1, y1);
		queueCommand('A,'+Math.round(l1[0])+','+Math.round(l1[1]));
		queueCommand('P,1');

		var dx = (x2 - x1);
		var dy = (y2 - y1);
		var d = Math.sqrt(dx*dx + dy*dy);

		var segments = 1 + (d / 5);
		segments = Math.ceil(Math.max(Math.min(20, segments), 2));

		dx /= segments;
		dy /= segments;

		var x = x1;
		var y = y1;

		for(var s = 0; s<segments; s++) {
			x += dx;
			y += dy;
			var l2 = calcLengthsFromBox(x, y);
			queueCommand('A,'+Math.round(l2[0])+','+Math.round(l2[1]));
		}

		queueCommand('P,0');
	}

	$('#canvas2').on('mouseup', function(e) {
		console.log('mouseup at', e.offsetX, e.offsetY);
		// calc lengths from mapped surface
		queueLine(lx, ly, e.offsetX / 2, e.offsetY / 2);
		linehistory.push({
			x1: lx,
			y1: ly,
			x2: e.offsetX / 2,
			y2: e.offsetY / 2
		});
		$('#text').val(JSON.stringify(linehistory, null, 2));
		drawLengths();
	});

	$('#exec').click(function() {
		var tmp = [];
		try {
			tmp = JSON.parse($('#text').val());
		} catch(e) {
			console.error(e);
		}
		console.log(tmp);
		if (tmp) {
			for(var i=0; i<tmp.length; i++) {
				var line = tmp[i];
				console.log('exec line', line);
				queueLine(line.x1, line.y1, line.x2, line.y2);
			}
		}
	});

	$('#load').click(function() {
		try {
			linehistory = JSON.parse($('#text').val());
		} catch(e) {
			console.error(e);
		}
		drawLengths();
	});

	$('#clear').click(function() {
		linehistory = [];
		drawLengths();
	});

	drawLengths();

	queuePoll();
});
