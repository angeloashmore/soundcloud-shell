const sendKeyPressJS = (keyCode, shiftKey = false) => (`
  e = new Event('keydown');
  e.keyCode = ${keyCode};
  ${shiftKey ? 'e.shiftKey = true;' : ''}
  document.dispatchEvent(e);
  e = new Event('keyup');
  e.keyCode = 32;
  document.dispatchEvent(e)
`)

module.exports = sendKeyPressJS
