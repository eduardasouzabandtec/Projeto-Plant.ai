var express = require('express');
var router = express.Router();
var sequelize = require('../models').sequelize;
var Leitura = require('../models').Leitura;

/* Recuperar as últimas N leituras */
router.get('/ultimas', function(req, res, next) {
	// quantas são as últimas leituras que quer? 8 está bom?
	const limite_linhas = 7;

	console.log(`Recuperando as últimas ${limite_linhas} leituras`);
	
	const instrucaoSql = `select top 10000 
	regTemperatura, 
	regUmidade, 
	regTemporal,
	fkProduto,
	idRegistro,
	FORMAT(regTemporal,'HH:mm:ss') as momento_grafico 
	from registro order by idRegistro ;`;

	sequelize.query(instrucaoSql, {
		model: Leitura,
		mapToModel: true 
	  })
	  .then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
	  }).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
	  });
});


// tempo real (último valor de cada leitura)
router.get('/tempo-real', function (req, res, next) {
	
	console.log(`Recuperando as últimas leituras`);

	const instrucaoSql = `select * from Registro order by idRegistro`;

	// sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
	// 	.then(resultado => {
	// 		res.json(resultado[0]);
	// 	}).catch(erro => {
	// 		console.error(erro);
	// 		res.status(500).send(erro.message);
	// 	});

	sequelize.query(instrucaoSql, {
		model: Leitura,
		mapToModel: true 
	  })
	  .then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
	  }).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
	  });
  
});


// estatísticas (max, min, média, mediana, quartis etc)
router.get('/estatisticas', function (req, res, next) {
	
	console.log(`Recuperando as estatísticas atuais`);

	const instrucaoSql = `select 
							max(regTemperatura) as temp_maxima, 
							min(regTemperatura) as temp_minima, 
							avg(regTemperatura) as temp_media,
							max(regUmidade) as umidade_maxima, 
							min(regUmidade) as umidade_minima, 
							avg(regUmidade) as umidade_media 
						from registro`;

	sequelize.query(instrucaoSql, { type: sequelize.QueryTypes.SELECT })
		.then(resultado => {
			res.json(resultado[0]);
		}).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
		});
  
});

// ProdutosCli (pega todos os produtos do cliente etc)
router.get(`/ProdutosCli/:login`, function (req, res, next) {
	console.log('entrando');
	let cliente = req.params.login;
	console.log('pegando cliente:', cliente);
	
	console.log(`Pegando os Produtos do Cliente`);

	const instrucaoSql = `select * from Produto,Planta,Cliente where email = '${cliente}' and fkPlanta = idPlanta and fkCliente=idCliente;`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: Leitura,
		mapToModel: true 
	  })
	  .then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
	  }).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
	  });
  
});

// ProdutosCli (pega todos os produtos do cliente etc)
router.get(`/plantaCli`, function (req, res, next) {
	console.log('entrando');
	
	console.log(`pegando as plantas`);

	const instrucaoSql = `select * from Planta;`;
	console.log(instrucaoSql);

	sequelize.query(instrucaoSql, {
		model: Leitura,
		mapToModel: true 
	  })
	  .then(resultado => {
			console.log(`Encontrados: ${resultado.length}`);
			res.json(resultado);
	  }).catch(erro => {
			console.error(erro);
			res.status(500).send(erro.message);
	  });
  
});

module.exports = router;
