function entrar() {
    var formulario = new URLSearchParams(new FormData(form_login));
    fetch("/usuarios/autenticar", {
        method: "POST",
        body: formulario
    }).then(resposta => {
        
        if (resposta.ok) {

            resposta.json().then(json => {


                sessionStorage.idCliente_usuario = json.idCliente;
                sessionStorage.nomeCliente_usuario = json.nomeCliente;
                sessionStorage.CPF_usuario = json.CPF;
                sessionStorage.email_usuario = json.email;
                sessionStorage.senha_usuario = json.senha;
                sessionStorage.conta_usuario = json.conta;
                sessionStorage.estado_usuario = json.estado;
                sessionStorage.cidade_usuario = json.cidade;
                sessionStorage.bairro_usuario = json.bairro;
                sessionStorage.rua_usuario = json.rua;
                sessionStorage.NumeroRua_usuario = json.numeroRua;
                window.location.href = 'home.html';
            });

        } else {

            alert('email e/ou senha inválido');

            response.text().then(texto => {
                alert(error(texto));
            });
        }
    });

    return false;
}