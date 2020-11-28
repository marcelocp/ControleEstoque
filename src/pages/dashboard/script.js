const db = require('../../db')
const conn = db.getConnection()
const {jsPDF} = require('jspdf')
const res = []

function createHeaders(keys) {
  var result = [];
  for (var i = 0; i < keys.length; i += 1) {
    result.push({
      name: keys[i],
      prompt: keys[i],
      width: 65,
      align: "center"
     // padding: 0
    });
  }
  return result;
}

document.addEventListener("DOMContentLoaded", function(event) {
  conn.query('SELECT * from fornecedor order by nome ASC', function (error, results, fields) {
    const res = results
    var comboForn = document.getElementById('fornecedor');
    var opt = document.createElement("option");
    var j = 0
    for(var i=0; i<res.length; i++){
			opt = document.createElement("option");
			opt.value = res[i].id;
			opt.text = res[i].nome;
			fornecedor.add(opt, comboForn.options[j]);
			j+= 1;
    } 
  })

  conn.query('SELECT * from cliente order by nome ASC', function (error, results, fields) {
    const res = results
    var comboCli = document.getElementById('cliente');
    var opt = document.createElement("option");
    var k = 0
    for(var i=0; i<res.length; i++){
			opt = document.createElement("option");
			opt.value = res[i].id;
			opt.text = res[i].nome;
			cliente.add(opt, comboCli.options[k]);
			k+= 1;
    } 
  })

  conn.query('SELECT * from estoque', function (error, results, fields) {
    const res = results
    let qtdade = 0
    let estoque = 0
    for(var i=0; i<res.length; i++){
      qtdade += Number(res[i].quantidade)
      if(res[i].quantidade > 0 ){
        estoque += res[i].valor_venda * res[i].quantidade
      }
    }
    document.getElementById('pecas').innerHTML = qtdade 
    document.getElementById('estoque').innerHTML = estoque.toFixed(2) 
  })

  conn.query('SELECT * from caixa', function (error, results, fields) {
    const res = results
    let venda = 0
    for(var i=0; i<res.length; i++){
      if(res[i].tipo === "ENTRADA"){
        venda += Number(res[i].valor)
      }
    }
    document.getElementById('vendas').innerHTML = venda.toFixed(2)
  })
})

function listarPrecos(){
  var headers = createHeaders([
    "Codigo",
    "Descricao",
    "Valor",
  ]);
  conn.query('SELECT * from estoque', function (error, results, fields){
    var doc = new jsPDF();
    doc.table(30,10,generateData(results.length, results), headers, '');
    doc.save("listaPreco.pdf");
    window.open(doc.output('bloburl'))
  })
}
function generateData(amount, res){
  var result = [];
  var data = {
    Codigo: "",
    Descricao: "",
    Valor: "",
  };
  for (var i = 0; i < amount; i += 1) {
    data.Codigo = (res[i].codigo).toString()
    data.Descricao = (res[i].descricao).toString()
    data.Valor = 'R$ '+ (res[i].valor_venda).toString()
    result.push(Object.assign({}, data));
  }
  return result;
};

function produtosEstoque(){
  var headers = createHeaders([
    "Fornecedor", 
    "Codigo",
    "Descricao",
    "Valor",
    "Quantidade",
  ],);
  conn.query('SELECT * from julingerie.estoque INNER JOIN fornecedor ON fornecedor.id = fornecedor where quantidade > 0 order by nome ASC', function (error, results, fields){
    var doc = new jsPDF('p','pt', 'a4', true);
    doc.table(50,10,generateDataEstoque(results.length, results), headers,  { autoSize:true });
    doc.save("produtos.pdf");
    window.open(doc.output('bloburl'))
  })
}
function generateDataEstoque(amount, res){
  var result = [];
  var data = {
    Fornecedor: "",
    Codigo: "",
    Descricao: "",
    Valor: "",
    Quantidade: "",
  };
  for (var i = 0; i < amount; i += 1) {
    data.Fornecedor = (res[i].nome).toString()
    data.Codigo = (res[i].codigo).toString()
    data.Descricao = (res[i].descricao).toString()
    data.Valor = 'R$ '+ (res[i].valor_venda).toString()
    data.Quantidade = (res[i].quantidade).toString()
    result.push(Object.assign({}, data));
  }
  return result;
};


function produtosFornecedor(){
  const fornecedor = document.getElementById('fornecedor').value
  var headers = createHeaders([
    "Codigo",
    "Descricao",
    "Valor",
    "Quantidade",
  ]);
  conn.query(`SELECT * from estoque INNER JOIN fornecedor ON fornecedor.id = fornecedor  where fornecedor = ${fornecedor} and quantidade > 0`, function (error, results, fields){
    var doc = new jsPDF();
    var valor = 0
    for(var i=0; i<results.length; i++){
      valor += Number(results[i].valor_venda)*Number(results[i].quantidade)
    }
    valor = valor.toFixed(2)
    doc.text(`Valor total em estoque (${results[0].nome}): R$ ${valor}`, 30, 10)
    doc.table(10,20,generateDataFornecedor(results.length, results), headers, '');
    doc.save("fornecedor.pdf");
    window.open(doc.output('bloburl'))
  })
}
function generateDataFornecedor(amount, res){
  var result = [];
  var data = {
    Codigo: "",
    Descricao: "",
    Valor: "",
    Quantidade: "",
  };
  for (var i = 0; i < amount; i += 1) {
    data.Codigo = (res[i].codigo).toString()
    data.Descricao = (res[i].descricao).toString()
    data.Valor = 'R$ '+ (res[i].valor_venda).toString()
    data.Quantidade = (res[i].quantidade).toString()
    result.push(Object.assign({}, data));
  }
  return result;
};

function pesquisaProduto(){
  const codId = document.getElementById('codId').value
  conn.query(`SELECT * from estoque where codigo = '${codId}'`, function (error, results, fields){
    if(results.length==0){
      Swal.fire({
        title: '<h3><strong>Erro</strong></h3>',
        allowEscapeKey: false,
        allowEnterKey: false,	
        allowOutsideClick: false,
        html: '<h4>Produto não localizado</h4>',
        icon: 'error'
      })
    }else{
      Swal.fire({
        title: '<h3><strong>Sucesso</strong></h3>',
        allowEscapeKey: false,
        allowEnterKey: false,	
        allowOutsideClick: false,
        html: `<h4>Quantidade do Produto ${results[0].descricao}: <strong>${results[0].quantidade}</strong></h4>`,
        icon: 'success'
      })
    }
  })
}

function produtosClientes(){
  const codCli = document.getElementById('cliente').value
  var headers = createHeaders([
    "Codigo",
    "Descricao",
    "Valor",
  ]);
  conn.query(`SELECT * from julingerie.venda INNER JOIN estoque ON estoque.id = produto_id  where cliente_id = '${codCli}'`, function (error, results, fields){
    var doc = new jsPDF();
    var valor = 0
    for(var i=0; i<results.length; i++){
      valor += Number(results[i].valor_venda)*Number(results[i].qdade)
    }
    valor = valor.toFixed(2)
    doc.text(`Valor total: ${valor}`, 30, 10)
    doc.table(30,30,generateDataCli(results.length, results), headers,'');
    doc.save("cliente.pdf");
    window.open(doc.output('bloburl'))
  })
}
function generateDataCli(amount, res){
  var result = [];
  var data = {
    Codigo: "",
    Descricao: "",
    Valor: "",
  };
  for (var i = 0; i < amount; i += 1) {
    data.Codigo = (res[i].codigo).toString()
    data.Descricao = (res[i].descricao).toString()
    data.Valor = 'R$ '+ (res[i].valor_venda).toString()
    result.push(Object.assign({}, data));
  }
  return result;
};