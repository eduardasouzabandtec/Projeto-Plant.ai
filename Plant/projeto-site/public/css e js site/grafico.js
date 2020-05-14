var cont = 0;
function pegarProdutos() {
    fetch(`/leituras/ProdutosCli/${email_usuario}`, { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];
                    console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                    // aqui, após 'registro.' use os nomes 
                    // dos atributos que vem no JSON 
                    // que gerou na consulta ao banco de dados

                    comboBox.innerHTML += `<option value="${registro.idProduto}">${registro.nomePlanta}</option><br>`
                }
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
}


var exibiu_grafico = true;

// só mexer se quiser alterar o tempo de atualização
// ou se souber o que está fazendo!
function atualizarGrafico() {
    obterDadosGrafico();
    setTimeout(atualizarGrafico, 2000);
}

// altere aqui as configurações do gráfico
// (tamanhos, cores, textos, etc)
function configurarGrafico() {
    var configurações = {
        responsive: true,
        animation: exibiu_grafico ? false : { duration: 1500 },
        hoverMode: 'index',
        stacked: false,
        title: {
            display: true,
            text: 'Histórico recente de umidade e Temperatura'
        },
        scales: {
            yAxes: [{
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: false,
                position: 'left',
                id: 'n usado',
            }, {
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'left',
                id: 'valor',

                // grid line settings
                gridLines: {
                    drawOnChartArea: true, // only want the grid lines for one axis to show up
                },
            }],
        }
    };

    exibiu_grafico = true;

    return configurações;
}

// altere aqui como os dados serão exibidos
// e como são recuperados do BackEnd
function obterDadosGrafico() {

    // neste JSON tem que ser 'labels', 'datasets' etc, 
    // porque é o padrão do Chart.js
    var dados = {
        labels: [],
        datasets: [
            {
                yAxisID: 'valor',
                label: 'temperatura(Cº)',
                borderColor: 'rgb(255,0,0)',
                backgroundColor: 'rgb(255,0,0)',
                fill: false,
                data: []
            },
            {
                yAxisID: 'valor',
                label: 'Umidade(%)',
                borderColor: 'rgb(0,0,255)',
                backgroundColor: 'rgb(0,0,255)',
                fill: false,
                data: []
            }
        ]
    };

    fetch('/leituras/ultimas', { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];

                    if (registro.fkProduto == comboBox.value) {
                        // aqui, após 'registro.' use os nomes 
                        // dos atributos que vem no JSON 
                        // que gerou na consulta ao banco de dados

                        dados.labels.push(registro.momento_grafico);

                        dados.datasets[0].data.push(registro.regTemperatura);
                        dados.datasets[1].data.push(registro.regUmidade);
                        cont++
                    }

                    if (cont == 7) {
                        cont =0;
                        break;
                    }

                }
                console.log(JSON.stringify(dados));

                div_aguarde.style.display = 'none';

                plotarGrafico(dados);
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ gráfico: ${error.message}`);
        });
}

// só altere aqui se souber o que está fazendo!
function plotarGrafico(dados) {
    console.log('iniciando plotagem do gráfico...');

    var ctx = canvas_grafico.getContext('2d');
    window.grafico_linha = Chart.Line(ctx, {
        data: dados,
        options: configurarGrafico()
    });
    alertas();
}
function mudandoPlanta() {
    var planta = 0;
    planta = document.getElementById("comboBox").options[document.getElementById("comboBox").selectedIndex].text;
    fetch('/leituras/plantaCli', { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];

                    if (registro.nomePlanta == planta) {
                        // aqui, após 'registro.' use os nomes 
                        // dos atributos que vem no JSON 
                        // que gerou na consulta ao banco de dados

                        nomePlanta.innerHTML = registro.nomePlanta;
                        tempMax.innerHTML = registro.tempMaxima;
                        tempTerQua.innerHTML = registro.tempTerQuartilT;
                        tempPriQua.innerHTML = registro.tempPriQuartil;
                        tempMin.innerHTML = registro.tempMinima;
                        umiMax.innerHTML = registro.umiMaxima;
                        umiTerQua.innerHTML = registro.umiTerQuartil;
                        umiPriQua.innerHTML = registro.umiPriQuartil;
                        umiMin.innerHTML = registro.umiMinima;
                        break;
                    }
                }
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ tabela: ${error.message}`);
        });
    obterDadosGrafico()
}

function alertas() {
    fetch('/leituras/tempo-real', { cache: 'no-store' }).then(function (response) {
        if (response.ok) {
            response.json().then(function (resposta) {

                console.log(`Dados recebidos: ${JSON.stringify(resposta)}`);

                resposta.reverse();

                for (i = 0; i < resposta.length; i++) {
                    var registro = resposta[i];

                    if (registro.fkProduto == comboBox.value) {
                        // aqui, após 'registro.' use os nomes 
                        // dos atributos que vem no JSON 
                        // que gerou na consulta ao banco de dados

                        if (registro.regTemperatura >= tempMax.innerHTML) { alerta_temp.innerHTML = `Temperatura crítica`; }
                        else if (registro.regTemperatura >= tempTerQua.innerHTML) { alerta_temp.innerHTML = `Temperatura perigosa` }
                        else if (registro.regTemperatura <= tempPriQua.innerHTML) { alerta_temp.innerHTML = `Temperatura perigosa` }
                        else if (registro.regTemperatura <= tempMin.innerHTML) { alerta_temp.innerHTML = `Temperatura crítica` }
                        else { alerta_temp.innerHTML = `` }

                        if (registro.regUmidade >= umiMax.innerHTML) { alerta_umi.innerHTML = `Umidade crítica`; }
                        else if (registro.regUmidade >= umiTerQua.innerHTML) { alerta_umi.innerHTML = `Umidade perigosa` }
                        else if (registro.regUmidade <= umiPriQua.innerHTML) { alerta_umi.innerHTML = `Umidade perigosa` }
                        else if (registro.regUmidade <= umiMin.innerHTML) { alerta_umi.innerHTML = `Umidade crítica` }
                        else { alerta_umi.innerHTML = ``; }
                        break;
                    }
                    if (comboBox.value == 0) {
                        alerta_temp.innerHTML = ``;
                        alerta_umi.innerHTML = ``;
                        nomePlanta.innerHTML = `   Informe a Planta   `;
                        tempMax.innerHTML = `   //   `;
                        tempTerQua.innerHTML = `   //   `;
                        tempPriQua.innerHTML = `   //   `;
                        tempMin.innerHTML = `   //   `;
                        umiMax.innerHTML = `   //   `;
                        umiTerQua.innerHTML = `   //   `;
                        umiPriQua.innerHTML = `   //   `;
                        umiMin.innerHTML = `   //   `;

                        break;
                    }
                }
            });
        } else {
            console.error('Nenhum dado encontrado ou erro na API');
        }
    })
        .catch(function (error) {
            console.error(`Erro na obtenção dos dados p/ tabela: ${error.message}`);
        });
}