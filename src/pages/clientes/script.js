const db = require('../../db')
const conn = db.getConnection()

function createClient(){
    const nome = document.getElementById('nome').value
    const email = document.getElementById('email').value
    const telefone = document.getElementById('telefone').value
    
    conn.query(`INSERT INTO cliente (nome, telefone, email) VALUES ('${nome}', '${telefone}', '${email}')`)
    // Swal.fire({
    //   title: '<h3><strong>Sucesso</strong></h3>',
    //   allowEscapeKey: false,
    //   allowEnterKey: false,	
    //   allowOutsideClick: false,
    //   html: '<h5>Cliente inserido com sucesso</h5>',
    //   icon: 'success'
    // })
   
}