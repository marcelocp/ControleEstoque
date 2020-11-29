const { format } = require('mysql')
const db = require('../../db')
const conn = db.getConnection()

document.addEventListener("DOMContentLoaded", function(event) {
  conn.query('SELECT * from cliente order by nome ASC', function (error, results, fields) {
    const res = results
    var comboCli = document.getElementById('clients');
    var opt = document.createElement("option");
    var j = 0
    for(var i=0; i<res.length; i++){
			opt = document.createElement("option");
			opt.value = res[i].id;
			opt.text = res[i].nome;
			clients.add(opt, comboCli.options[j]);
			j+= 1;
    } 
  })
})

function verificarEstoque(cod, qtdade, data, clienteId, desc){
  conn.query(`Select * from estoque where codigo = '${cod}'`, function (error, results, fields) {
    if(results.length > 0){
      if (results[0].quantidade >= qtdade){
        //Baixar estoque
        const novaQtdade = Number(results[0].quantidade - Number(qtdade))
        conn.query(`Update estoque Set quantidade = ${novaQtdade}  where codigo = '${cod}'`)
        inserirVendas(results[0].valor_venda, results[0].id, data, qtdade, clienteId, desc)
      }else{
        Swal.fire({
          title: '<h3><strong>Atenção</strong></h3>',
          allowEscapeKey: false,
          allowEnterKey: false,	
          allowOutsideClick: false,
          html: '<h4>Produto em estoque menor que quantidade vendida, corrigir estoque primeiro</h4>',
          icon: 'warning'
        })
        document.querySelector('form').reset()
      }
    }else{
      Swal.fire({
        title: '<h3><strong>Erro</strong></h3>',
        allowEscapeKey: false,
        allowEnterKey: false,	
        allowOutsideClick: false,
        html: '<h4>Produto não localizado, verifique se digitou o código correto ou se o produto foi cadastrado</h4>',
        icon: 'error'
      })
      document.querySelector('form').reset()
    }
  })
}

function inserirVendas(valor, pId, dataVenda, qtdade, clienteId, desc){
  const descontoFinal = Number(valor)*desc/100
  const valorFinal = (Number(valor) * qtdade)-descontoFinal
  conn.query(`Insert into venda (data_venda, valor_venda, cliente_id, produto_id, qdade)
    values ('${dataVenda}',${valorFinal},${clienteId},${pId}, ${qtdade})`)
  
  //Inclui no Caixa
  conn.query(`Insert into caixa (data_operacao, tipo, valor) 
    values ('${dataVenda}', 'ENTRADA', ${valorFinal})`) 
}

function createVendas(){
  const desconto = document.getElementById('desconto').value
  const clienteId = document.getElementById('clients').value
  const dataVenda = document.getElementById('dataVenda').value
  const cod = document.getElementById('codigo').value
  const qtade = document.getElementById('quantidade').value
  verificarEstoque(cod, qtade, dataVenda, clienteId, desconto)

  Swal.fire({
    title: '<h3><strong>Sucesso</strong></h3>',
    allowEscapeKey: false,
    allowEnterKey: false,	
    allowOutsideClick: false,
    html: '<h4>Venda cadastrada com sucesso</h4>',
    icon: 'success'
  })

  document.getElementById('codigo').value =''
  
}
