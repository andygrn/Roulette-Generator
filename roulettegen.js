
/*

	Roulette Generator
	Andy Green
	http://andygrn.co.uk
	August 2011

*/

var canvas,
	pen,
	parameter_inputs = [],
	colour_inputs = [];

function init()
{

	var detect_feature = document.createElement('input');
	detect_feature.setAttribute('type', 'range');
	
	if (detect_feature.type !== 'range')
	{
		
		document.getElementById('compatibility-message').style.display = 'block';
		
	}
	
	canvas = document.getElementById('canvas');
	
	pen = canvas.getContext('2d');
	pen.translate(canvas.width / 2, canvas.height / 2);
	
	parameter_input_ids = [
		'param-spiral-sharpness',
		'param-spiral-inner-radius',
		'param-spiral-outer-radius',
		'param-spiral-distance',
		'param-line-thickness'
	];
	
	colour_input_ids = [
		'param-line-colour-r',
		'param-line-colour-g',
		'param-line-colour-b'
	];
	
	for (var i in parameter_input_ids)
	{
	
		parameter_inputs[i] = document.getElementById(parameter_input_ids[i]);
	
	}
	
	for (var i in colour_input_ids)
	{
	
		colour_inputs[i] = document.getElementById(colour_input_ids[i]);
	
	}
	
	initUI();
	prepareDraw();

}

function initUI()
{

	document.getElementById('control-draw').addEventListener('click', prepareDraw, false);
	document.getElementById('control-save').addEventListener('click', saveCanvas, false);
	document.getElementById('control-clear').addEventListener('click', clearCanvas, false);

	for (var i in parameter_inputs)
	{

		document.getElementById(parameter_inputs[i].id + '-value').innerHTML = parameter_inputs[i].value;

		parameter_inputs[i].addEventListener('input', function(){

			var readout = document.getElementById(this.id + '-value')
			readout.innerHTML = this.value;
			
		}, false);
		
	}

}

function prepareDraw()
{

	var values = [],
		colour = [],
		roulette_option = document.getElementById('option-roulette-type1').checked;
	
	for (var i in parameter_inputs)
	{
		
		values[i] = parseInt(parameter_inputs[i].value);
		
	}
	
	for (var i in colour_inputs)
	{
		
		var c = parseInt(colour_inputs[i].value);
		
		if (c > 255)
		{
		
			c = 255;
		
		}
		else if (c < 0)
		{
		
			c = 0;
		
		}
		
		colour[i] = c;
		
	}
	
	if (roulette_option)
	{
	
		drawEpitrochoid(
			values[0],
			values[1],
			values[2],
			values[3],
			values[4],
			colour
		);
	
	}
	else
	{
	
		drawHypotrochoid(
			values[0],
			values[1],
			values[2],
			values[3],
			values[4],
			colour
		);
	
	}

}

function drawEpitrochoid(sharpness, inner_radius, outer_radius, distance, thickness, colour)
{

	var	t = 0,
		xi = inner_radius + outer_radius + distance,
		yi = 0,
		x,
		y;
	
	pen.lineWidth = thickness;
	pen.strokeStyle = 'rgba(' + colour[0] + ', ' + colour[1] + ', ' + colour[2] + ', 1)';
	
	pen.beginPath();
	pen.moveTo(xi, yi);
	
	do
	{
		
		if (t > 10000)
		{
		
			break;
		
		}

		t += Math.PI / sharpness;
		
		x = ((inner_radius + outer_radius) * Math.cos(t)) + (distance * Math.cos(((inner_radius + outer_radius) / outer_radius) * (t)));
		y = ((inner_radius + outer_radius) * Math.sin(t)) - (distance * Math.sin(((inner_radius + outer_radius) / outer_radius) * (t)));
		
		pen.lineTo(x, y);
		
	}
	while (x != xi && y != yi)
	
	pen.stroke();

}

function drawHypotrochoid(sharpness, inner_radius, outer_radius, distance, thickness, colour)
{

	var	t = 0,
		xi = (inner_radius - outer_radius) + distance,
		yi = 0,
		x,
		y;
	
	pen.lineWidth = thickness;
	pen.strokeStyle = 'rgba(' + colour[0] + ', ' + colour[1] + ', ' + colour[2] + ', 1)';
	
	pen.beginPath();
	pen.moveTo(xi, yi);
	
	do
	{
		
		if (t > 10000)
		{
		
			break;
		
		}
		
		t += Math.PI / sharpness;
		
		x = ((inner_radius - outer_radius) * Math.cos(t)) + (distance * Math.cos(((inner_radius - outer_radius) / outer_radius) * (t)));
		y = ((inner_radius - outer_radius) * Math.sin(t)) - (distance * Math.sin(((inner_radius - outer_radius) / outer_radius) * (t)));

		pen.lineTo(x, y);
		
	}
	while (x != xi && y != yi)
	
	pen.stroke();

}

function clearCanvas()
{

	pen.clearRect(canvas.width / -2, canvas.height / -2, canvas.width, canvas.height);

}

function saveCanvas()
{

	var image_data = canvas.toDataURL('image/png');

//	image_data = image_data.replace('image/png', 'application/octet-stream');

	document.location.href = image_data;

}
