var GM = require('./glMatrix.js');

var HardwarePainter = function() {
	this.pixels = new Array(70*70);
	for(var i=0; i<70*70; i++) this.pixels[i] = '.';
	this.x = 0;
	this.y = 0;
	this.pen = false;
	this.lines = [];
}

HardwarePainter.prototype.moveTo = function(x, y, callback) {
	// console.log('HardwarePainter::moveTo('+x+','+y+')');

	if (this.pen) {
		// console.log('HardwarePainter::penUp');
		this.pen = true;
	}

	var _this = this;
	// console.log('HardwarePainter::currentPosition = ['+_this.x+','+_this.y+']');
	if (x != this.x || y != this.y) {

		var d = Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y));

		// setTimeout(function() {
		_this.x = x;
		_this.y = y;
		// console.log('HardwarePainter::newPosition = ['+_this.x+','+_this.y+']');
		callback();
		// }, );

	}  else {

		setTimeout(callback, 0);
	}
}

HardwarePainter.prototype.lineTo = function(x, y, callback) {
	// console.log('HardwarePainter::lineTo('+x+','+y+')');

	if (!this.pen) {
		// console.log('HardwarePainter::penDown');
		this.pen = true;
	}

	var _this = this;
	// console.log('HardwarePainter::currentPosition = ['+_this.x+','+_this.y+']');
	if (x != this.x || y != this.y) {

		var dx = (x - this.x);
		var dy = (y - this.y);
		var d = Math.sqrt(dx * dx + dy * dy);
		var s = Math.ceil(d);
		var tx = this.x;
		var ty = this.y;
		dx = dx / s;
		dy = dy / s;
		for(var i=0; i<=s; i++) {
			if (ty >= 0 && ty < 70 && tx >= 0 && tx < 70) {
				_this.pixels[Math.floor(ty) * 70 + Math.floor(tx)] = 'x';
			}

			tx += dx;
			ty += dy;
		}

		_this.lines.push({
			x1: Math.round(this.x * 100.0) / 100.0,
			y1: Math.round(this.y * 100.0) / 100.0,
			x2: Math.round(x * 100.0) / 100.0,
			y2: Math.round(y * 100.0) / 100.0
		});

		//	setTimeout(function() {
		_this.x = x;
		_this.y = y;
		// console.log('HardwarePainter::newposition = ['+_this.x+','+_this.y+']');
		callback();
		//	}, 1 + 1 * d);

	}  else {

		setTimeout(callback, 0);

	}
}

HardwarePainter.prototype.dump = function() {
	for(var j=0; j<70; j++) {
		var str = '';
		for(var i=0; i<70; i++) {
			str += this.pixels[j*70+i];
			str += ' ';
		}
		console.log(str);
	}
	console.log(this.lines);
}









var PaintQueue = function(device) {
	this.device = device;
	this.currentTransform = null;
	this.transformStack = [];
	this._calcMatrix();
	this.q = [];
}

PaintQueue.prototype._queue = function(cmd) {
	// console.log('PaintQueue:_queue', cmd);
	this.q.push(cmd);
}

PaintQueue.prototype.moveTo = function(x, y) {
	this._queue({ type:'moveto', x:x, y:y });
}

PaintQueue.prototype.lineTo = function(x, y) {
	this._queue({ type:'lineto', x:x, y:y });
}

PaintQueue.prototype.dotAt = function(x, y) {
	this._queue({ type:'moveto', x:x, y:y });
	this._queue({ type:'lineto', x:x, y:y });
}

PaintQueue.prototype.pushMatrix = function(matrix) {
	this._queue({ type:'pushmatrix', matrix:matrix });
}

PaintQueue.prototype.popMatrix = function() {
	this._queue({ type:'popmatrix' });
}

PaintQueue.prototype._calcMatrix = function() {
	// console.log('PaintQueue::_calcMatrix');
	var m = [];
	GM.mat4.identity(m);
	// var m = [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0]];

	this.transformStack.forEach(function(m2) {
		// console.log('PaintQueue::_calcMatrix apply', m2);
		// apply m2 to m

		var m42 = GM.mat4.create(m2);

		GM.mat4.multiply(m, m42, m);

		// console.log('PaintQueue::_calcMatrix temp', m42);
	});

	// console.log('PaintQueue::_calcMatrix return', m);
	this.currentTransform = m;
}

PaintQueue.prototype._executecommand = function(cmd, callback) {

	if (cmd.type == 'moveto') {
		var v = [cmd.x, cmd.y, 1.0];
		GM.mat4.multiplyVec3(this.currentTransform, v);
		this.device.moveTo(v[0], v[1], callback);
	}
	else if (cmd.type == 'lineto') {
		var v = [cmd.x, cmd.y, 1.0];
		GM.mat4.multiplyVec3(this.currentTransform, v);
		this.device.lineTo(v[0], v[1], callback);
	}
	else if (cmd.type == 'pushmatrix') {
		this.transformStack.push(cmd.matrix);
		this._calcMatrix();
		callback();
	}
	else if (cmd.type == 'popmatrix') {
		this.transformStack.pop();
		this._calcMatrix();
		callback();
	}
	else {
		callback();
	}
}

PaintQueue.prototype._tick = function() {
	if (this.q.length > 0) {
		var cmd = this.q[0];
		this.q.splice(0, 1);
		// console.log('tick got command', cmd);
		var _this = this;
		this._executecommand(cmd, function() {
			setTimeout(_this._tick.bind(_this), 0);
		});
	} else {
		this.runCallback.call(this);
		this.runCallback = null;
	}
}

PaintQueue.prototype.run = function(callback) {
	this.runCallback = callback;
	this._tick();
}

function box(q) {
	q.moveTo(-10,-10);
	q.lineTo(-10,10);
	q.lineTo(10,10);
	q.lineTo(10,-10);
	q.lineTo(-10,-10);
}

var p = new HardwarePainter();
// var p = new MockPainter();

var q = new PaintQueue(p);

/*

q.pushMatrix([1,  0,  0,  0,
              0,  1,  0,  0,
              0,  0,  1,  0,
              25, 25, 0,  1]);

box(q);

for(var i=0; i<10; i++) {
	q.pushMatrix([0.9419, -0.5397, 0,  0,
	              0.5397,  0.9419, 0,  0,
	              0,       0,      1,  0,
     	          2,       -3,      0,  1]);

	box(q);
}

for(var i=0; i<10; i++) {
	q.popMatrix();
}

q.moveTo(0,0);
*/


var SVG = function(q) {
	this.q = q;
}

SVG.prototype.polygon = function(data) {
	// closed poly
	var pts = data.points.split(' ');
	var cleanpts = [];
	pts.forEach(function(t1) {
		// console.log('point', t1);
		var t2 = t1.split(',');
		if (t2.length == 2) {
			cleanpts.push({ x: parseFloat(t2[0]), y: parseFloat(t2[1]) });
		}
	});
	// console.log('cleanpts', cleanpts);
	this.q.moveTo(cleanpts[0].x, cleanpts[0].y);
	for(var i=0; i<cleanpts.length; i++) {
		this.q.lineTo(cleanpts[i].x, cleanpts[i].y);
	}
	this.q.lineTo(cleanpts[0].x, cleanpts[0].y);
}

SVG.prototype.line = function(data) {

	this.q.moveTo(data.x1, data.y1);
	this.q.lineTo(data.x2, data.y2);

}

SVG.prototype.ellipse = function(data) {
	var x = parseFloat(data.cx);
	var y = parseFloat(data.cy);
	var w = parseFloat(data.rx);
	var h = parseFloat(data.ry);
	var steps = 15;
	for(var i=0; i<=steps; i++) {
		var x2 = x + w * Math.sin( i * Math.PI / (steps / 2.0) );
		var y2 = y + h * Math.cos( i * Math.PI / (steps / 2.0) );
		if (i == 0)
			this.q.moveTo(x2, y2);
		else
			this.q.lineTo(x2, y2);
	}
}

SVG.prototype.circle = function(data) {
	data.rx = data.r;
	data.ry = data.r;
	this.ellipse(data);
}

SVG.prototype.path = function(data) {
	console.log('before path');

	// M 224.267, 251.074
	// c 5.665 -5.056, 10.355 -8.771, 10.355 -8.771
	// c 0.73, 0, 0.913, 0.67, 0.913, 1.341
	// l 0.122, 2.984
	// c -0.122, 0.426-1.097, 2.01-2.559, 4.203
	// h 2.985
	// c 1.766, 0, 6.761, 0, 7.857, 1.34
	// c 0.548, 0.67, 1.035, 1.462, 1.035, 2.071
	// c 0, 0.608 -0.487, 1.035 -1.827, 1.035
	// c -1.157, 0.062 -6.883, 0.122 -13.218, 0.122
	// c -16.447, 16.994 -18.092, 24.121 -20.528, 24.121
	// c -2.619, 0 -4.812 -2.01 -4.812 -4.629
	// c 0-4.264, 7.432 -12.365, 14.924 -19.432
	// h -9.381
	// z

	// M move abs (x, y)
	// m move rel

	// C curve abs (x1 y1 x2 y2 x y)
	// c curve rel

	// H hor abs (x)
	// h hor rel

	// V ver abs (y)
	// v ver rel

	var last = '';
	var cmd = '';

	var commandchars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	var cmds = [];

	function parseargs(str) {
		console.log('parseargs', str);
		var args = [];
		var last = '';
		str.split('').forEach(function(ch2) {
			if (ch2 == '-') {
				if (last != '') {
					args.push(parseFloat(last));
					last = '';
				}
				last = '-';
			} else if (ch2 == ',') {
				if (last != '') {
					args.push(parseFloat(last));
					last = '';
				}
			} else {
				last += ch2;
			}
		});
		if (last != '') {
			args.push(parseFloat(last));
			last = '';
		}
		return args;
	}

	data.d.split('').forEach(function(ch) {
		if (commandchars.indexOf(ch) != -1) {
			if (cmd != '') {
				cmds.push([cmd, parseargs(last)]);
				cmd = '';
				last = '';
			}
			cmd = ch;
		} else {
			last += ch;
		}
	});
	if (cmd != '') {
		cmds.push([cmd, parseargs(last)]);
		cmd = '';
		last = '';
	}

	console.log('after path');

	console.log('path commands', cmds);

	var x = 0;
	var y = 0;
	var fx = 0;
	var fy = 0;
	var _this = this;
	cmds.forEach(function(cmdobj) {
		var cmd = cmdobj[0];
		var args = cmdobj[1];
		if (cmd == 'M') {
			x = args[0];
			y = args[1];
			fx = x;
			fy = y;
			_this.q.moveTo(x, y);
		}
		else if (cmd == 'c') {
			x += args[4];
			y += args[5];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'v') {
			y += args[0];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'V') {
			y = args[0];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'h') {
			x += args[0];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'H') {
			x = args[0];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'l') {
			x += args[0];
			y += args[1];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'L') {
			x = args[0];
			y = args[1];
			_this.q.lineTo(x, y);
		}
		else if (cmd == 'z') {
			_this.q.lineTo(fx, fy);
		}
		else {
			console.error('Unhandled svg path command: ' + cmd, args);
		}
	});
}



// q.pushMatrix([0.4,  0,  0, 0, 0, 0.4, 0, 0, 0, 0, 1, 0, -10, -40, 0, 1]);
q.pushMatrix([1,  0,  0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

var s = new SVG(q);

// s.polygon({ points: "226,229.5 156.764,218.004 108.042,268.522 97.58,199.121 34.479,168.396 97.25,137 106.973,67.492 156.229,117.489 225.339,105.257 193.01,167.552 " });
// s.polygon({ points: "310.167,142.833 291.264,170.804 303.59,202.233 271.147,192.899 245.065,214.334 243.917,180.594 215.472,162.413 247.205,150.894 255.707,118.223 276.467,144.844 " });
// s.polygon({ points: "367.667,188.667 345.632,190.285 334.473,209.354 326.125,188.897 304.541,184.177 321.417,169.917 319.236,147.931 338.013,159.573 358.25,150.705 352.979,172.161 " });
// s.polygon({ points: "374.333,205.333 365.904,208.259 363.535,216.862 358.147,209.75 349.233,210.155 354.333,202.833 351.193,194.481 359.732,197.069 366.705,191.501 366.883,200.422 " });

// s.path({
// 	fill: "#FFFFFF",
// 	stroke: "#000000",
// 	stroke_miterlimit: "10",
// 	d="M243.5,387.167c0,4.971-4.029,9-9,9H133.333c-4.971,0-9-4.029-9-9v-59.5c0-4.971,4.029-9,9-9H234.5c4.971,0,9,4.029,9,9V387.167z"
// });

// s.ellipse({ cx: "268.917", cy: "255.75", rx: "18.75", ry: "17.917" });
// s.circle({ cx: "310.167", cy: "246.167", r: "21.667" });
// s.ellipse({ transform: "matrix(0.8419 -0.5397 0.5397 0.8419 -221.0321 184.6237)", cx: "204.542", cy: "469.5", rx: "64.375", ry: "15.833" });

// s.line({ x1: "268.5", y1: "298.667", x2: "447.667", y2: "436.167" })
// s.line({ x1: "331.833", y1: "403.667", x2: "465.167", y2: "237.833" });
// s.line({ x1: "349.233", y1: "268.522", x2: "481", y2: "357.417" })

/*
s.path({ d: "M51.818,234.628c6.335,0,10.903,1.767,10.903,6.03c0,2.376-7.432,12.548-10.416,12.548c-0.609,0-1.218-0.67-1.218-1.218c0-1.584,2.985-3.229,2.985-4.751c0-0.366-0.548-0.549-1.401-0.549c-4.751,0-20.101,4.995-20.101,7.31c0,1.462,4.873,0.549,12.487,1.584c7.554,1.035,8.467,5.482,8.467,7.614c-0.061,9.259-21.563,18.64-36.122,18.64c-7.432,0-12.975-2.437-12.975-8.589c0-4.021,4.629-5.848,6.274-6.518c1.949,1.766,6.396,1.645,8.832,1.766c14.314-0.913,20.589-6.578,21.015-8.649c-0.122-0.975-0.975-1.157-2.68-1.157c-3.716,0-9.502-0.183-12.853-0.243c-4.934-0.062-8.589-2.924-8.589-6.944C16.427,242.852,38.112,234.628,51.818,234.628z" });
s.path({ d: "M72.286,265.694c2.314,0,5.969-1.827,6.274-1.827c0.426,0,0.731,0.548,0.731,0.914c0,0.853-4.873,2.802-7.675,2.802c-0.304,0-0.548,0-1.036-0.062c-0.426,0-0.67,0.244-0.853,0.671c-3.046,5.543-6.944,11.634-13.096,11.634c-2.559,0-4.873-1.584-4.873-5.969c0-9.32,10.233-15.594,15.776-15.594c2.132,0.243,4.934,0.853,4.934,2.984c0,0.609-0.305,1.157-0.487,1.462c-0.366,0.487-0.914,0.427-1.279,0.609c-0.244,0.243-0.365,0.487-0.365,0.73C70.336,265.268,71.189,265.694,72.286,265.694z M60.468,275.684c1.34,0,7.736-6.335,7.736-9.929c0-0.244-0.122-0.366-0.365-0.366c-0.914,0-8.163,5.36-8.163,9.138C59.676,275.135,59.859,275.684,60.468,275.684z" });
s.path({ d: "M83.312,260.516c0.548-0.243,1.279-0.426,2.01-0.426c1.34,0,2.802,0.853,2.802,2.619c0,1.827-1.827,3.594-2.132,4.081c-0.122,0.183-0.183,0.305-0.183,0.427c0,0.121,0.061,0.243,0.183,0.243c1.036,0,8.102-7.248,12.244-7.248c1.523,0,2.802,0.975,2.802,2.558c0,1.219-1.523,2.559-2.315,3.776c-0.122,0.184-0.183,0.305-0.183,0.427c0,0.183,0.183,0.244,0.365,0.244c1.401,0,6.335-5.604,8.894-5.604c1.827,0,2.802,2.01,2.802,3.229c0,2.01-6.213,8.162-6.213,9.563c0,0.243,0.122,0.487,0.426,0.487c0.792-0.122,0.975-0.67,1.767-0.67c0.609,0,0.792,0.305,0.792,0.67c0,2.802-3.838,4.995-7.127,4.995c-2.437,0-4.568-1.219-4.568-4.265c0-1.157,0.914-3.229,1.583-3.959c0.122-0.244,0.183-0.365,0.183-0.487s-0.061-0.183-0.183-0.183c-0.183,0-0.366,0.061-0.548,0.183c-1.035,0.487-8.284,7.857-11.33,7.857c-1.888,0-2.62-1.827-2.62-2.924c0-1.4,1.34-3.532,1.828-4.142c0.122-0.183,0.183-0.365,0.183-0.549c0-0.183-0.061-0.304-0.244-0.304c-0.122,0-0.305,0.061-0.548,0.243c-1.949,1.584-8.65,6.822-10.965,6.822c-1.583,0-2.741-1.584-2.741-3.167C70.276,268.739,83.312,260.516,83.312,260.516z" });
s.path({ d: "M132.835,268.8c0.548,0,0.853,0.427,0.853,0.854c-0.061,1.157-14.619,9.867-20.527,9.867c-3.351,0-4.203-2.314-4.203-4.446c0-2.984,6.944-6.03,6.944-6.762c0-0.853-3.411-0.975-3.411-3.594c0-4.812,10.233-9.563,16.264-9.563c3.35,0,6.213,1.219,6.213,4.021c0,3.229-5.97,5.604-6.883,5.604c-0.609,0-1.279-0.366-1.279-0.792c0-0.67,3.35-1.157,3.35-2.315c0-0.183-0.305-0.304-0.67-0.304c-1.157,0-10.842,3.472-10.842,4.629c0,0.609,1.279,0.67,1.767,0.67c0.792,0,1.949-0.305,2.985-0.305c1.096,0,2.071,0.366,2.071,2.071c0,2.559-8.102,5.117-8.102,6.64c0,0.243,0.183,0.427,0.975,0.548C122.054,275.622,131.434,268.8,132.835,268.8z" });
s.path({ d: "M165.242,251.074c5.665-5.056,10.355-8.771,10.355-8.771c0.73,0,0.913,0.67,0.913,1.341l0.122,2.984c-0.122,0.426-1.097,2.01-2.559,4.203h2.985c1.766,0,6.761,0,7.857,1.34c0.548,0.67,1.035,1.462,1.035,2.071c0,0.608-0.487,1.035-1.827,1.035c-1.157,0.062-6.883,0.122-13.218,0.122c-16.447,16.994-18.092,24.121-20.528,24.121c-2.619,0-4.812-2.01-4.812-4.629c0-4.264,7.432-12.365,14.924-19.432h-9.381c-1.219,0-2.314-0.183-2.314-1.522C148.795,253.39,152.145,251.744,165.242,251.074z" });
s.path({ d: "M186.074,268.8c0.549,0,0.854,0.427,0.854,0.854c-0.062,1.157-14.619,9.867-20.528,9.867c-3.35,0-4.203-2.314-4.203-4.446c0-2.984,6.944-6.03,6.944-6.762c0-0.853-3.411-0.975-3.411-3.594c0-4.812,10.233-9.563,16.264-9.563c3.351,0,6.213,1.219,6.213,4.021c0,3.229-5.969,5.604-6.883,5.604c-0.609,0-1.279-0.366-1.279-0.792c0-0.67,3.351-1.157,3.351-2.315c0-0.183-0.305-0.304-0.67-0.304c-1.157,0-10.843,3.472-10.843,4.629c0,0.609,1.279,0.67,1.767,0.67c0.792,0,1.949-0.305,2.984-0.305c1.097,0,2.071,0.366,2.071,2.071c0,2.559-8.102,5.117-8.102,6.64c0,0.243,0.183,0.427,0.975,0.548C175.292,275.622,184.673,268.8,186.074,268.8z" });
s.path({ d: "M195.698,271.359c-4.873,4.325-8.893,8.711-11.756,8.711c-1.462,0-3.106-2.193-3.106-3.411c0-3.898,5.178-8.589,10.721-12.305c-1.522-2.802-2.559-5.238-2.559-6.274c0-0.365,0.548-1.462,0.914-1.462c0.122,0,0.183,0.062,0.243,0.244c0.487,1.279,1.828,3.594,3.473,6.213c5.116-3.229,9.989-5.482,10.842-5.482c0,0,3.29,0.122,3.29,2.315c0,2.132-4.752,5.238-9.99,9.624c2.681,4.203,5.056,7.979,5.056,8.894c0,0.791-0.853,0.791-0.853,0.791C200.998,278.973,198.317,275.501,195.698,271.359z" });
s.path({ d: "M224.267,251.074c5.665-5.056,10.355-8.771,10.355-8.771c0.73,0,0.913,0.67,0.913,1.341l0.122,2.984c-0.122,0.426-1.097,2.01-2.559,4.203h2.985c1.766,0,6.761,0,7.857,1.34c0.548,0.67,1.035,1.462,1.035,2.071c0,0.608-0.487,1.035-1.827,1.035c-1.157,0.062-6.883,0.122-13.218,0.122c-16.447,16.994-18.092,24.121-20.528,24.121c-2.619,0-4.812-2.01-4.812-4.629c0-4.264,7.432-12.365,14.924-19.432h-9.381c-1.219,0-2.314-0.183-2.314-1.522C207.821,253.39,211.17,251.744,224.267,251.074z" });
s.path({ d: "M81.138,178.214c4.331-7.687,14.383-20.296,30.158-37.833l-4.728-9.085c-3.782-7.268-7.128-11.955-10.035-14.063c-4.908-3.512-11.174-3.286-18.797,0.681c-3.634,1.891-6.608,4.617-8.921,8.174c-2.276,3.63-2.543,7.119-0.8,10.468c0.444,0.855,1.372,2.206,2.786,4.05c1.413,1.846,2.269,3.054,2.565,3.623c2.077,3.991,2.203,7.456,0.384,10.395c-1.014,1.705-2.555,3.096-4.621,4.17c-3.206,1.669-6.211,1.897-9.016,0.686c-2.804-1.211-4.873-3.101-6.208-5.666c-2.596-4.986-2.23-11.81,1.097-20.469c3.325-8.657,10.938-16.083,22.838-22.275c13.822-7.193,25.528-7.581,35.116-1.162c5.194,3.544,10.24,10.019,15.135,19.423l22.304,42.857c2.151,4.134,3.919,6.836,5.305,8.105c2.372,2.297,5.019,2.686,7.941,1.164c1.638-0.853,2.862-1.806,3.672-2.861c0.81-1.054,2.03-3.23,3.666-6.525l2.892,5.557c-0.834,3.966-2.105,7.527-3.813,10.678c-2.582,4.786-5.939,8.252-10.07,10.402c-4.847,2.522-9.171,2.782-12.976,0.776c-3.805-2.003-6.944-5.123-9.42-9.358c-2.969,7.521-5.781,13.423-8.443,17.704c-4.481,7.223-9.645,12.354-15.485,15.394c-6.129,3.189-12.557,3.797-19.29,1.821c-6.731-1.974-11.822-6.274-15.271-12.9C73.726,201.814,74.405,190.503,81.138,178.214z M114.078,145.724c-6.785,6.974-11.995,13.489-15.634,19.546c-6.96,11.682-8.345,21.548-4.155,29.599c3.375,6.484,7.997,10.146,13.866,10.984c3.816,0.549,7.436-0.067,10.855-1.847c4.701-2.447,8.522-6.109,11.462-10.99c2.938-4.878,3.351-9.351,1.237-13.412L114.078,145.724z" });
*/

s.path({ d: 'M13.421,5.901v4.404c0.143,0,0.297,0,0.439,0V5.901h8.523v15.421v1.947H13.86v-4.404c-0.143,0-0.297,0-0.439,0v4.404H4.897c0-5.805,0-11.574,0-17.368H13.421z' });
s.path({ d: 'M37.812,11.599h-5.021c0,0.143,0,0.285,0,0.427h5.021v5.141h-5.021c0,0.143,0,0.285,0,0.427h5.021v5.687c-4.843,0-9.723,0-14.554,0V5.913c4.832,0,9.711,0,14.554,0V11.599z' });
s.path({ d: 'M38.673,23.269c0-5.781,0-11.562,0-17.368c2.885,0,7.312,0,10.209,0c0,2.944,0,5.865,0,8.809h3.324v8.559C47.149,23.269,43.754,23.269,38.673,23.269z' });
s.path({ d: 'M53.078,23.269c0-5.781,0-11.562,0-17.368c2.885,0,7.312,0,10.209,0c0,2.944,0,5.865,0,8.809h3.324v8.559C61.555,23.269,58.159,23.269,53.078,23.269z'});
s.path({ d: 'M82.905,7.955v13.403l-2.03,1.935H69.503l-2.03-1.935V7.955l2.03-2.042h11.372L82.905,7.955z'});
s.path({ d: 'M20.128,27.979c0,2.825,0,5.615,0,8.405l-2.078,2.066h-4.523v4.867c-2.896,0-5.781,0-8.642,0c0-5.782,0-11.563,0-17.38c4.404,0,8.796,0,13.165,0L20.128,27.979z'});
s.path({ d: 'M36.375,27.955v13.403l-2.03,1.935H22.972l-2.03-1.935V27.955l2.03-2.042h11.373L36.375,27.955z'});
s.path({ d: 'M37.224,43.269c0-5.781,0-11.562,0-17.368c2.885,0,7.313,0,10.209,0c0,2.944,0,5.865,0,8.809h3.324v8.559C45.7,43.269,42.305,43.269,37.224,43.269z'});
s.path({ d: 'M60.498,41.322c0-1.389,0-2.707,0-4.06h-0.226v4.06l-1.911,1.947H51.63v-8.5l4.131-8.88h13.392v17.379c-2.256,0-4.487,0-6.743,0L60.498,41.322z'});
s.path({ d: 'M85.221,27.919c0,2.826,0,3.906,0,6.708l-2.054,2.03l2.612,6.648L69.99,43.269c0-5.793,0-11.586,0-17.379c4.404,0,8.785,0,13.177,0L85.221,27.919z'});
s.path({ d: 'M4.921,63.316L4.886,45.89h6.719l1.923,1.923v4.155h0.214v-4.155l1.947-1.923c1.591,0,3.17,0,4.808,0l1.911,1.923c0,1.389,0,2.79,0,4.155h0.214v-4.155l1.923-1.923h6.743v8.595l-4.143,8.832H4.921z'});
s.path({ d: 'M47.621,47.955v13.403l-2.03,1.935H34.218l-2.03-1.935V47.955l2.03-2.042h11.373L47.621,47.955z'});
s.path({ d: 'M63.701,47.919c0,2.826,0,3.906,0,6.708l-2.054,2.03l2.612,6.647L48.471,63.27c0-5.794,0-11.587,0-17.38c4.404,0,8.785,0,13.177,0L63.701,47.919z'});
s.path({ d: 'M64.526,63.27c0-5.781,0-11.562,0-17.368c2.885,0,7.312,0,10.209,0c0,2.944,0,5.864,0,8.809h3.324v8.56C73.003,63.27,69.607,63.27,64.526,63.27z'});
s.path({ d: 'M94.52,47.919v13.439l-2.065,1.946H78.98c0-5.805,0-11.622,0-17.415h13.474L94.52,47.919z'});

s.polygon({ points: "13.766,83.244 9.98,78.26 3.728,78.554 7.298,73.412 5.087,67.557 11.08,69.364 15.966,65.451 16.099,71.709 21.33,75.147 15.419,77.207 " });










q.run(function() {
	console.log('Painting done.');
	p.dump();
});









