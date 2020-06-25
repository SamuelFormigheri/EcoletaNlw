const botaoDeSearchTelaHome = document.querySelector("#page-home main .btnPesquisarPontosColeta");
const modal = document.querySelector("#modal");
const closeBotao = document.querySelector("#modal .header a");

botaoDeSearchTelaHome.addEventListener("click", function(){
     modal.classList.toggle("hide");
 });

 closeBotao.addEventListener("click", function(){
    modal.classList.add("hide");
});
