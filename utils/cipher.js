function encode(text, secretKey = 'alwaysBeKind') {
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    result += String.fromCharCode(textChar + keyChar);
  }

  return result;
}

function decode(encodedText, secretKey = 'alwaysBeKind') {
  let result = '';

  for (let i = 0; i < encodedText.length; i++) {
    const encodedChar = encodedText.charCodeAt(i);
    const keyChar = secretKey.charCodeAt(i % secretKey.length);
    result += String.fromCharCode(encodedChar - keyChar);
  }

  return result;
}

export {encode, decode};
