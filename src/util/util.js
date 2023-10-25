const RETURN_MESSAGES = require('./errorMessages');

const handleResponse = (code) => {
  return {
    code: code,
    message: getMessage(code),
  };
};

const handleError = (code, error, errorCode) => {
  return {
    code: code,
    message: getMessage(code),
    errorCode: errorCode,
    error: error,
  };
};

const getMessage = (code) => {
    return RETURN_MESSAGES[code];
}

module.exports = {handleResponse, handleError};