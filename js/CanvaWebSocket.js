function CanvaWebSocket(wbUrl){
	var canvaWebSocket = this;
	this.deb = true;
	
	this.ws = new WebSocket(wbUrl);

	this.ws.onmessage = function(evt) { 
		var jsonData = JSON.parse(evt.data);
		var ev = { type: jsonData[0], _x: jsonData[1], _y: jsonData[2]};
		var func = canvaWebSocket.tool[ev.type];
		if (func) {
			func(ev);
		}
	};
	this.ws.onclose = function() { CanvaWebSocket.debug("socket closed"); };
	this.ws.onopen = function() { CanvaWebSocket.debug("connected..."); };

	this.init = function(canvaId) {
		// Find the canvas element.
		this.canvas = document.getElementById(canvaId);
		if (!this.canvas) {
			alert('Error: I cannot find the canvas element!');
			return;
		}

		if (!this.canvas.getContext) {
			alert('Error: no canvas.getContext!');
			return;
		}

		// Get the 2D canvas context.
		var context = this.canvas.getContext('2d');
		if (!context) {
			alert('Error: failed to getContext!');
			return;
		}

		// Pencil tool instance.
		this.tool = new ToolPencil(context);

		// Attach the mousedown, mousemove and mouseup event listeners.
		this.canvas.addEventListener('mousedown', this.evCanvas, false);
		this.canvas.addEventListener('mousemove', this.evCanvas, false);
		this.canvas.addEventListener('mouseup',   this.evCanvas, false);
	}
	
	// The general-purpose event handler. This function just determines the mouse 
	// position relative to the canvas element.
  	this.evCanvas = function (ev) {
	    if (ev.layerX || ev.layerX == 0) { // Firefox
	      ev._x = ev.layerX;
	      ev._y = ev.layerY;
	    } else if (ev.offsetX || ev.offsetX == 0) { // Opera
	      ev._x = ev.offsetX;
	      ev._y = ev.offsetY;
	    }
		ev._x = ev._x - canvaWebSocket.canvas.offsetLeft;
		ev._y = ev._y - canvaWebSocket.canvas.offsetTop;
		var data = [ev.type, ev._x, ev._y];
		var dataStr = JSON.stringify(data);
		canvaWebSocket.ws.send(dataStr);
  	}

  	CanvaWebSocket.debug = function (str){ 
		if(this.deb){
			$("#debug").append("<p>" +  str);				
		} 
	}
}