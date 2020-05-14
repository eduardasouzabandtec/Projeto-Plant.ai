let email_usuario;
let senha_usuario;

function redirecionar_login() {
    window.location.href = 'login.html';
}

function tipoCliente(){
    if (sessionStorage.conta_usuario = "p"){
        // coloque aq sua ideia (CAIO)
        btnPlanta.disabled = true
    } else {
        btnPlanta.disabled = false
    }
}

function verificar_autenticacao() {

    email_usuario = sessionStorage.email_usuario;
    senha_usuario = sessionStorage.senha_usuario;
    validar_sessao();
    
    if (email_usuario == undefined)  {
        alert(`erro ao verificar Perfil`);
        // redirecionar_login();
    }
    
}

function newFunction() {
    b_usuario.innerHTML = email_usuario;
}

function logoff() {
    window.location.href = 'index.html';
    finalizar_sessao();
    sessionStorage.clear();
    redirecionar_login();
}

function validar_sessao() {
    fetch(`/usuarios/sessao/${email_usuario}`, {cache:'no-store'})
    .then(resposta => {
        if (resposta.ok) {
            resposta.text().then(texto => {
                console.log('Sessão :) ', texto);    
            });
        } else {
            console.error('Sessão :.( ');
            logoff();
        } 
    });    
}

function finalizar_sessao() {
    fetch(`/usuarios/sair/${email_usuario}`, {cache:'no-store'}); 
}