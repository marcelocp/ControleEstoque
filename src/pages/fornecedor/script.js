const db = require('../../db')
const conn = db.getConnection()

function createFornecedor(){
  const nome = document.getElementById('nome').value
  const telefone = document.getElementById('telefone').value
  conn.query(`INSERT INTO fornecedor (nome, telefone) VALUES ('${nome}', '${telefone}')`, function (error, results, fields) {
    if(error){
      Swal.fire({
        title: '<h3><strong>Erro</strong></h3>',
        allowEscapeKey: false,
        allowEnterKey: false,	
        allowOutsideClick: false,
        html: `<h4>${error}<h4>`,
        icon: 'error'
      })
    }else{
      Swal.fire({
        title: '<h3><strong>Sucesso</strong></h3>',
        allowEscapeKey: false,
        allowEnterKey: false,	
        allowOutsideClick: false,
        html: '<h4>Salvo com sucesso<h4>',
        icon: 'success'
      })
    }
  })
  document.querySelector('form').reset() 
}