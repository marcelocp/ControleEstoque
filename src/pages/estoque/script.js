const db = require('../../db')
const conn = db.getConnection()
let texto = ''

document.addEventListener("DOMContentLoaded", function(event) {
  conn.query('SELECT * from fornecedor', function (error, results, fields) {
    const res = results
    var comboFornecedor = document.getElementById('fornecedor');
    var opt = document.createElement("option");
    var j = 0
    for(var i=0; i<res.length; i++){
			opt = document.createElement("option");
			opt.value = res[i].id;
			opt.text = res[i].nome;
			fornecedor.add(opt, comboFornecedor.options[j]);
			j+= 1;
    } 
  })
  
  document.getElementById('div-desc').style.display = 'none'
  document.getElementById('div-fornecedor').style.display = 'none'
  document.getElementById('div-tipo').style.display = 'none'
})

function limparForm(){
  document.querySelector('form').reset();
  document.getElementById('div-desc').style.display = 'none'
  document.getElementById('div-fornecedor').style.display = 'none'
  document.getElementById('div-tipo').style.display = 'none'
}

function buscarProduto(){
  const codigo = document.getElementById('codigo').value
  conn.query(`Select * from estoque where codigo='${codigo}'`, function (error, results, fields) {
    const res = results
    if(res.length > 0){
      const id = res[0].config_id
      conn.query(`Select * from config where id=${id}`, function (error, results, fields) {
        document.getElementById('tipo').text = results[0].tipo
      })
      
      document.getElementById('descricao').value = res[0].descricao
      document.getElementById('fornecedor').value = res[0].fornecedor
      document.getElementById('valor-compra').value = res[0].valor_compra
    }else{
      document.getElementById('div-desc').style.display = ''
      document.getElementById('div-fornecedor').style.display = 'block'
      document.getElementById('div-tipo').style.display = 'block'
      return null
    }
  })
}

function createProduct(){
  const codigo = document.getElementById('codigo').value
  const descricao = document.getElementById('descricao').value
  const fornecedor = document.getElementById('fornecedor').value
  let quantidade = document.getElementById('quantidade').value
  const valor_compra = Number(document.getElementById('valor-compra').value)
  const desconto = Number(document.getElementById('desconto').value)
  const tipo = document.getElementById('tipo').value
  const lucro = Number(document.getElementById('lucro').value)
  const valor_final = (valor_compra)-((valor_compra)*(desconto)/100)
  const valor_venda = (valor_final)+(valor_final*lucro/100)

  //Estoque
  conn.query(`Select quantidade from estoque where codigo='${codigo}'`,function (error, results, fields) {
    const res = results
    if(res.length > 0){
      quantidade = Number(quantidade) + Number(res[0].quantidade)
      conn.query(`Update estoque SET quantidade = ${quantidade}, valor_compra = ${valor_final}, 
                  valor_venda = ${valor_venda} where codigo='${codigo}'`)
    }else{
      quantidade = Number(document.getElementById('quantidade').value)
      conn.query(`Select * from config where tipo='${tipo}'`, function (error, results, fields) {
       conn.query(`Insert into estoque (codigo, descricao, fornecedor, quantidade, valor_compra, valor_venda, config_id)
        values ('${codigo}', '${descricao}', '${fornecedor}', ${quantidade}, ${valor_final}, ${valor_venda}, ${results[0].id})`)
      })
   }
  })
  
  //Caixa
  const valor_final_compra = valor_final*quantidade
  const dataCompra = document.getElementById('data-compra').value
  conn.query(`Insert into caixa (data_operacao, tipo, valor) values ('${dataCompra}', 'SAIDA', ${valor_final_compra})`) 
  
  Swal.fire({
    title: '<h3><strong>Sucesso</strong></h3>',
    allowEscapeKey: false,
    allowEnterKey: false,	
    allowOutsideClick: false,
    html: '<h5>Produto Cadastrado!!!</h5>',
    icon: 'success'
  })
  limparForm()
}

