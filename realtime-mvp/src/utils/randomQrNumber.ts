export function randomQrCode(len: number) {
  let code = '';

  for (let count = 0; count < len; count++) {
    const randomNumber = Math.floor(Math.random() * 10);
    code += randomNumber.toString();
  }
  return code;
}
