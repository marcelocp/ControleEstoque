const db = require('../../db')
const conn = db.getConnection()

document.addEventListener("DOMContentLoaded", ()=>{
  conn.query('SELECT * from config', function (error, results, fields) {
      const res = results
      for(var i=0; i<res.length; i++){
        switch (res[i].tipo){
          case "Calcinhas":
            document.getElementById('calcinha').value = res[i].percentual
            break
          case "Conjuntos":
            document.getElementById('conjunto').value = res[i].percentual
            break
          case "Pijamas":
            document.getElementById('pijama').value = res[i].percentual
            break
          case "Sutia":
            document.getElementById('sutia').value = res[i].percentual
            break
        }
      } 
    })
});


function updateType(){
    const calcinha = document.getElementById('calcinha').value
    const conj = document.getElementById('conjunto').value
    const pijama = document.getElementById('pijama').value
    const sutia = document.getElementById('sutia').value
    conn.query(`UPDATE config SET percentual=${calcinha} where tipo='Calcinhas'`)
    conn.query(`UPDATE config set percentual=${conj} where tipo ='Conjuntos'`)
    conn.query(`UPDATE config set percentual=${pijama} where tipo ='Pijamas'`)
    conn.query(`UPDATE config set percentual=${sutia} where tipo ='Sutia'`)
    Swal.fire({
      title: '<h3><strong>Sucesso</strong></h3>',
      allowEscapeKey: false,
      allowEnterKey: false,	
      allowOutsideClick: false,
      html: '<h5>Tabela atualizada com sucesso</h5>',
      icon: 'success'
    })
}