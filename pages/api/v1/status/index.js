function status(request, response) {
  response.status(200).json({
    chave: "valor",
    alunos: "sao acima da média",
  });
}

export default status;
