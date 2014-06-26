const keyLookUpTable = {
    32: ' ',
    191: '?',
    46: 'delete',
    67: 'c',
    80: 'p',
    71: 'g',
    65: 'a',
    90: 'z',
    37: 'left',
    39: 'right',
    81: 'q',
    86: 'v',
    27: 'esc',
    76: 'l',
    90: 'z',
    49: '1',
    87: 'w',
    13: 'return',
    48: '0',
    82: 'r',
    91: 'meta',
    192: '`'
}

var keyConverter = function(ev) {
    var cmd = "";
    if(ev.shiftKey === true) { cmd = cmd+"shift+"; }
    if(ev.ctrlKey === true) { cmd = cmd+"ctrl+"; }
    if(ev.altKey === true) { cmd = cmd+"alt+"; }
    if(ev.metaKey === true) { cmd = cmd+"meta+"; }
    return cmd+keyLookUpTable[ev.which];
}

var keyHandlerByCase = function(cases) {
  return function(ev) {
    var propogate = true;
    var handler = cases[keyConverter(ev)];
    if(handler === undefined) {
          handler = cases['default'];
        if(handler === undefined) { return; }
    }
      propogate = handler(ev);
    if(propogate === false) {
        ev.preventDefault();
        dutils.stopPropagation();
    }
  }
}