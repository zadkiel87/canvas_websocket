$(document).ready(function() {
	var canvas, context, tool, ws, debug;
	
	deb = true;

	ws = new WebSocket("ws://localhost:8085/");
	
    ws.onmessage = function(evt) { 
		var jsonData = JSON.parse(evt.data);
		var ev = { type: jsonData[0], _x: jsonData[1], _y: jsonData[2]};
		var func = tool[ev.type];
	    if (func) {
	      func(ev);
	    }
	};
    ws.onclose = function() { debug("socket closed"); };
    ws.onopen = function() {
      debug("connected...");
    };

	init();
	
	function init () {
		// Find the canvas element.
		canvas = document.getElementById('imageView');
		if (!canvas) {
			alert('Error: I cannot find the canvas element!');
			return;
		}

		if (!canvas.getContext) {
			alert('Error: no canvas.getContext!');
			return;
		}

		// Get the 2D canvas context.
		context = canvas.getContext('2d');
		if (!context) {
			alert('Error: failed to getContext!');
			return;
		}

		// Pencil tool instance.
		tool = new tool_pencil();

		// Attach the mousedown, mousemove and mouseup event listeners.
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup',   ev_canvas, false);
	}

	// This painting tool works like a drawing pencil which tracks the mouse 
	// movements.
	function tool_pencil () {
		var tool = this;
		this.started = false;

		// This is called when you start holding down the mouse button.
		// This starts the pencil drawing.
		this.mousedown = function (ev) {
			context.beginPath();
			context.moveTo(ev._x, ev._y);
			tool.started = true;
		};

		// This function is called every time you move the mouse. Obviously, it only 
		// draws if the tool.started state is set to true (when you are holding down 
			// the mouse button).
		this.mousemove = function (ev) {
			if (tool.started) {
				context.lineTo(ev._x, ev._y);
				context.stroke();
			}
		};

		// This is called when you release the mouse button.
		this.mouseup = function (ev) {
			if (tool.started) {
				tool.mousemove(ev);
				tool.started = false;
			}
		};
	}
	
	// The general-purpose event handler. This function just determines the mouse 
	// position relative to the canvas element.
  function ev_canvas (ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

	var data = [ev.type, ev._x, ev._y];
	var dataStr = JSON.stringify(data);
	ws.send(dataStr);
  }

  function debug(str){ 
		if(deb){
			$("#debug").append("<p>" +  str);				
		} 
	}
});