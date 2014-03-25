Speedometer = function (spec) {

	that = {};

	var self = that;

	var iCurrentSpeed = 0,
		iTargetSpeed = 0,
		bDecrement = null,
		job = null,
		maxVal = spec.maxVal,
		markerSpeed = 50;

	var elem = document.getElementById(spec.elementId);
	var canvas = document.createElement('canvas');
	canvas.width = spec.size;
    canvas.height = spec.size + 70;

    elem.appendChild(canvas);

	function degToRad(angle) {
		// Degrees to radians
		return ((angle * Math.PI) / 180);
	}

	function radToDeg(angle) {
		// Radians to degree
		return ((angle * 180) / Math.PI);
	}

	function drawLine(options, line) {
		// Draw a line using the line object passed in
		options.ctx.beginPath();

		// Set attributes of open
		options.ctx.globalAlpha = line.alpha;
		options.ctx.lineWidth = line.lineWidth;
		options.ctx.fillStyle = line.fillStyle;
		options.ctx.strokeStyle = line.fillStyle;
		options.ctx.moveTo(line.from.X,
			line.from.Y);

		// Plot the line
		options.ctx.lineTo(
			line.to.X,
			line.to.Y
		);

		options.ctx.stroke();
	}

	function createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
		// Create a line object using Javascript object notation
		return {
			from: {
				X: fromX,
				Y: fromY
			},
			to:	{
				X: toX,
				Y: toY
			},
			fillStyle: fillStyle,
			lineWidth: lineWidth,
			alpha: alpha
		};
	}

	function roundedRectangle(options, x, y, w, h) {
		var context = options.ctx;
		var wr = w/10;
		var hr = h/5;
		context.beginPath(); 
		context.moveTo(x, y + hr);
		context.quadraticCurveTo(x, y, x + wr, y);
		context.lineTo(x + w - wr, y);
		context.quadraticCurveTo(x + w, y, x + w, y + hr);
		context.lineTo(x + w, y + h - hr);
		context.quadraticCurveTo(x + w, y + h, x + w - wr, y + h);
		context.lineTo(x + wr, y + h);
		context.quadraticCurveTo(x, y+h, x, y + h - hr);
		context.lineTo(x, y + hr);    
		context.stroke();
		context.fill();
	}

	function drawTicks(options) {
		/* The small tick marks against the coloured
		 * arc drawn every 5 mph from 10 degrees to
		 * 170 degrees.
		 */

		var iTick = 0,
		    iTickRad = 0,
		    onArchX,
		    onArchY,
		    innerTickX,
		    innerTickY,
		    fromX,
		    fromY,
		    line,
			toX,
			toY;

		for (iTick = 120; iTick <= 420; iTick += 30) {

			iTickRad = degToRad(iTick);

			onArchX = options.radius + (Math.cos(iTickRad) * options.radius * 0.82);
			onArchY = options.radius + (Math.sin(iTickRad) * options.radius * 0.82);
			innerTickX = options.radius + (Math.cos(iTickRad) * options.radius * 0.84);
			innerTickY = options.radius + (Math.sin(iTickRad) * options.radius * 0.84);

			fromX = (options.center.X - options.radius) + onArchX;
			fromY = (options.center.Y - options.radius) + onArchY;
			toX = (options.center.X - options.radius) + innerTickX;
			toY = (options.center.Y - options.radius) + innerTickY;

			line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

			drawLine(options, line);

		}
	}

	function drawTextMarkers(options) {
		/* The text labels marks above the coloured
		 * arc drawn every 10 mph from 10 degrees to
		 * 170 degrees.
		 */
		var innerTickX = 0,
		    innerTickY = 0,
	        iTick = 0,
	        iTickToPrint = 0;

		// Font styling
		options.ctx.font = '13px comfortaa';
		options.ctx.fillStyle = '#099EC6';
		options.ctx.textBaseline = 'top';

		options.ctx.beginPath();

		for (iTick = 120; iTick <= 420; iTick += 30) {

			if (iTick > 270) options.ctx.textAlign = 'right';
			if (iTick < 270) options.ctx.textAlign = 'left';
			if (iTick == 270) options.ctx.textAlign = 'center';

			innerTickX = Math.cos(degToRad(iTick)) * options.radius * 0.77;
			innerTickY = Math.sin(degToRad(iTick)) * options.radius * 0.77;

			iTickToPrint = Math.floor(((iTick - 120) * maxVal) / 300); 

			options.ctx.fillText(iTickToPrint, options.center.X + innerTickX, options.center.Y + innerTickY);
		}

		options.ctx.textAlign = 'center';

		options.ctx.font = '60px comfortaa';
		options.ctx.fillStyle = 'rgba(127,127,127,0.5)';
		options.ctx.fillText(spec.units, options.center.X, options.center.Y + options.radius/5);

		options.ctx.globalAlpha = 1.0;
		options.ctx.font = '30px comfortaa';
		options.ctx.fillStyle = '#002E67';
		options.ctx.fillText(spec.name, options.center.X, options.center.Y + options.radius - 40);

	    options.ctx.stroke();
	}

	function drawSpeedometerColourArc(options) {

		options.ctx.beginPath();

		var grd = options.ctx.createLinearGradient(0, 0, 0, options.radius*2);
		grd.addColorStop(0, "#099EC6");
		grd.addColorStop(1, "#002E67");

		options.ctx.globalAlpha = 1.0;
		options.ctx.lineWidth = 5;
		options.ctx.strokeStyle = grd;

		options.ctx.arc(options.center.X,
			options.center.Y,
			options.radius - 10,
			(2*Math.PI / 360) * 60,
			(2*Math.PI / 360) * 270,
			true);

		options.ctx.stroke();

		options.ctx.beginPath();
		var grd2 = options.ctx.createLinearGradient(0, 0, 0, options.radius*2);
		grd2.addColorStop(0, "#099EC6");
		grd2.addColorStop(1, "white");

		options.ctx.strokeStyle = grd2;

		options.ctx.arc(options.center.X,
			options.center.Y,
			options.radius - 10,
			(2*Math.PI / 360) * 270,
			(2*Math.PI / 360) * 120,
			true);

		options.ctx.stroke();

	}

	function drawNeedleDial(options, alphaValue, fillStyle, strokeStyle) {
		/* Draws the metallic dial that covers the base of the
		* needle.
		*/

		options.ctx.globalAlpha = alphaValue;
		options.ctx.lineWidth = 3;
		//options.ctx.strokeStyle = strokeStyle;
		options.ctx.fillStyle = fillStyle;

		options.ctx.beginPath();
		options.ctx.arc(options.center.X,
			options.center.Y,
			10,
			0,
			2*Math.PI,
			true);

		options.ctx.fill();
		//options.ctx.stroke();

	}

	function drawNeedle(options) {

		var iSpeedAsAngle = (options.speed * 300 / maxVal) + 120,
		    iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
	        innerTickX = options.radius + (Math.cos(iSpeedAsAngleRad) * 10),
	        innerTickY = options.radius + (Math.sin(iSpeedAsAngleRad) * 10),
	        fromX = (options.center.X - options.radius) + innerTickX,
	        fromY = (options.center.Y - options.radius) + innerTickY,
	        endNeedleX = options.radius + (Math.cos(iSpeedAsAngleRad) * (options.radius * 0.55)),
	        endNeedleY = options.radius + (Math.sin(iSpeedAsAngleRad) * (options.radius * 0.55)),
	        toX = (options.center.X - options.radius) + endNeedleX,
	        toY = (options.center.Y - options.radius) + endNeedleY,
	        line = createLine(fromX, fromY, toX, toY, '#099EC6', 5, 0.6);

		drawLine(options, line);

		drawNeedleDial(options, 1, "#002E67", '');

	}

	function drawScore(options) {

		options.ctx.beginPath();
		options.ctx.strokeStyle = 'transparent';
		options.ctx.fillStyle = 'white';
		options.ctx.shadowOffsetX = 1;
		options.ctx.shadowOffsetY = 1;
		options.ctx.shadowBlur = 5;
		options.ctx.shadowColor = "gray";

		var fromX = options.center.X - options.radius/3;
		var fromY = options.center.Y + options.radius + 5;
		var width = options.radius/1.5;
		var height = 25;

		roundedRectangle(options, fromX, fromY, width, height);

		options.ctx.shadowColor = "transparent";
		options.ctx.beginPath();

		options.ctx.textAlign = 'center';
		options.ctx.font = '18px comfortaa';
		options.ctx.fillStyle = 'rgb(127,127,127)';
		options.ctx.fillText(options.speed, fromX + width/2, fromY + height/6);

		options.ctx.textAlign = 'right';
		options.ctx.font = '22px comfortaa';
		options.ctx.fillStyle = 'rgba(127,127,127,0.5)';
		options.ctx.fillText(spec.units, fromX + width - 5, fromY);

	    options.ctx.stroke();

	}

	function buildOptionsAsJSON(canvas, iSpeed) {

		var centerX = canvas.width / 2,
		    centerY = canvas.width / 2,
	        radius = spec.size / 2;

		// Create a speedometer object using Javascript object notation
		return {
			ctx: canvas.getContext('2d'),
			speed: iSpeed,
			center:	{
				X: centerX,
				Y: centerY
			},
			radius: radius
		};
	}

	function clearCanvas(options) {
		options.ctx.clearRect(0, 0, spec.size, spec.size + 70);
	}

	that.draw = function() {

		var options = null;

		if (canvas.getContext) {
			options = buildOptionsAsJSON(canvas, iCurrentSpeed);

		    clearCanvas(options);
			drawTicks(options);
			drawTextMarkers(options);
			drawSpeedometerColourArc(options);
			drawNeedle(options);
			drawScore(options);

		} else {
			alert("Canvas not supported by your browser!");
		}

		if(iTargetSpeed == iCurrentSpeed) {
			clearTimeout(job);
			return;
		} else if(iTargetSpeed < iCurrentSpeed) {
			bDecrement = true;
		} else if(iTargetSpeed > iCurrentSpeed) {
			bDecrement = false;
		}

		if(bDecrement) {
			if(iCurrentSpeed - 10 < iTargetSpeed)
				iCurrentSpeed = iCurrentSpeed - 1;
			else
				iCurrentSpeed = iCurrentSpeed - 5;
		} else {

			if(iCurrentSpeed + 10 > iTargetSpeed)
				iCurrentSpeed = iCurrentSpeed + 1;
			else
				iCurrentSpeed = iCurrentSpeed + 5;
		}

		job = setTimeout(function() {
        	self.draw();
        }, markerSpeed);
	}

	that.drawWithInputValue = function(val) {

        iTargetSpeed = val;
		if (iTargetSpeed < 0) {
			iTargetSpeed = 0;
		} else if (iTargetSpeed > maxVal) {
			iTargetSpeed = maxVal;
        }

        job = setTimeout(function() {
        	self.draw();
        }, markerSpeed);
	}

    return that;
    
}