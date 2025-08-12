function validateRFC(rfc) {
  const pattern = /^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
  return pattern.test(rfc);
}

module.exports = validateRFC;