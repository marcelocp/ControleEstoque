const db = require('../../db')
const conn = db.getConnection()

document.addEventListener("DOMContentLoaded", ()=>{
 
});


function updateCaixa(){
    const valor = document.getElementById('valor').value
    const data = document.getElementById('data').value
    const desc = document.getElementById('desc').value
    console.log(data)
    conn.query(`INSERT INTO caixa (data_operacao,tipo, valor, descricao) VALUES ('${data}','SAIDA',${valor}, '${desc}')`,function (error, results, fields) {
      if(error){
        Swal.fire({
          title: '<h3><strong>Error</strong></h3>',
          allowEscapeKey: false,
          allowEnterKey: false,	
          allowOutsideClick: false,
          html: `<h6>${error}</h6>`,
          icon: 'error'
        })
      }else{
        Swal.fire({
          title: '<h3><strong>Sucesso</strong></h3>',
          allowEscapeKey: false,
          allowEnterKey: false,	
          allowOutsideClick: false,
          html: '<h5>Saída em caixa registrada com sucesso</h5>',
          icon: 'success'
        })
        document.querySelector('form').reset();
      }
    })
    
}