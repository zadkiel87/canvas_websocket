function ToolPencil(context){
	var toolPencil = this;
	this.started = false;
	this.context = context;
	
	// This is called when you start holding down the mouse button.
	// This starts the pencil drawing.
	this.mousedown = function (ev) {
		toolPencil.context.beginPath();
		toolPencil.context.moveTo(ev._x, ev._y);
		toolPencil.started = true;
	};

	// This function is called every time you move the mouse. Obviously, it only 
	// draws if the tool.started state is set to true (when you are holding down 
		// the mouse button).
	this.mousemove = function (ev) {
		if (toolPencil.started) {
			toolPencil.context.lineTo(ev._x, ev._y);
			toolPencil.context.stroke();
		}
	};

	// This is called when you release the mouse button.
	this.mouseup = function (ev) {
		if (toolPencil.started) {
			toolPencil.mousemove(ev);
			toolPencil.started = false;
		}
	};
}