const mouseLookUpTable = {
    0: 'button1',
    2: 'button2'
}

var mouseConverter = function(ev) {
    var cmd = "";
    if(ev.shiftKey === true) { cmd = cmd+"shift+"; }
    if(ev.ctrlKey === true) { cmd = cmd+"ctrl+"; }
    if(ev.altKey === true) { cmd = cmd+"alt+"; }
    if(ev.metaKey === true) { cmd = cmd+"meta+"; }
    return cmd+mouseLookUpTable[ev.button];
}

var mouseHandlerByCase = function(cases) {
	return function(ev) {
		var propogate = true;
		var handler = cases[mouseConverter(ev)];
		if(handler === undefined) {
	        handler = cases['default'];
    		if(handler === undefined) { return; }
		}
	    propogate = handler(ev);
		if(propogate === false) {
		    dutils.stopPropagation(ev);
		}
	}
}

var wheelHandleMaker = function (handle) {
		return function(event) {
        var delta = 0;
        if (!event) /* For IE. */
                event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta/120;
                /** In Opera 9, delta differs in sign as compared to IE.
                 */
                if (window.opera)
                        delta = -delta;
        } else if (event.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
                delta = -event.detail/3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta)
                handle(delta);
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (event.preventDefault)
                event.preventDefault();
	  event.returnValue = false;
  }
}