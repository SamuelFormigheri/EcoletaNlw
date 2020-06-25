function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]");
        fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
        .then( function(res){return res.json();} )// Retorna o Json com os Estados
        .then(function(states){ //Cria as Options com o Json de retorno
            for(const state of states){
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
            
        });
}

function getCitiesByUf(event){
    const citySelect = document.querySelector("select[name=city]");
    const stateInput = document.querySelector("input[name=state]");

    ufValue = event.target.value;
    indexSelected = event.target.selectedIndex;

    stateInput.value = event.target.options[indexSelected].text;

    citySelect.innerHTML = "";
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`)
    .then(function(res){return res.json();} ) //Retorna o Json com os municipios
    .then(function(citys){
        for(const city of citys){
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
    });
    citySelect.removeAttribute("disabled");
}

function selecionarItem(event){    
    const item = event.target;
    //Toggle executa o add ou remove, dependendo se tem ou não.
    item.classList.toggle("selected");

    const itemId = item.dataset.id;

    //Verificar os itens selecionados e pegá-los para passar no submit,
    // se já estiver selecionado ele remove
    //Atualizar a input hidden com o valor dos campos escondidos


    const itensJaSelecionados = itensSelecionados.findIndex(function(item){
        return item == itemId; //Retorna V / F caso encontrou
    });

    //Maior que zero significa que encontrou o index do array que contém o value
    // Se encontrou e foi selecionado denovo remove, se não ele encontrou e apenas o adiciona
    if (itensJaSelecionados >= 0) 
    {
        const itensFiltrados = itensSelecionados.filter(function(item){
            return item != itemId;
        });

        itensSelecionados = itensFiltrados;
    }
    else
    {
        itensSelecionados.push(itemId);
    }
   
    selectedItens.value = itensSelecionados;
}

let itensSelecionados = [];
const selectedItens = document.querySelector("input[name=itensSelecionados]");
populateUFs();

 document
    .querySelector("select[name=uf]")
    .addEventListener("change",getCitiesByUf);


//Itens de Coleta
//Pegar todos os li's
const itensToCollect = document.querySelectorAll(".itens-grid li");
for(const item of itensToCollect){
    item.addEventListener("click", selecionarItem);
}

