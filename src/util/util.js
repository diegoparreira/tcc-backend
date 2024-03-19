const OPERATIONS = {
  GET: {message: `recuperado(s) com sucesso.`, code: 200},
  CHANGE: {message: 'alterado(s) com sucesso.', code: 200},
  CREATE: {message: 'criado(s) com sucesso.', code: 201},
  APPROVE: {message: 'aprovado(s) com sucesso.', code: 200},
  DELETE: {message: 'deletado(s) com sucesso.', code: 200},
  NOT_FOUND: {message: 'não encontrado(s).', code: 404},
  SERVER_ERROR: {message: 'Erro interno do servidor', code: 500}
}

function sendResponse(res, resource, data = null, operation) {
  let httpStatus        = OPERATIONS[operation].code;
  let stringComplement  = OPERATIONS[operation].message;
  let isServerError     = operation === 'SERVER_ERROR';
  let key               = !isServerError ? 'data' : 'errors';
  let message           = !isServerError ? `${resource} ${stringComplement}`: OPERATIONS[operation].message;
  let errors;

  console.log("Teste");
  console.log(data);

  try {
    errors = JSON.parse(data);
  } catch (error) {
    errors = data;
  }

  res.status(httpStatus).json({
    message: message,
    data: !isServerError ? data : null,
    errors: isServerError ? errors : null
  });
}

module.exports = {sendResponse};