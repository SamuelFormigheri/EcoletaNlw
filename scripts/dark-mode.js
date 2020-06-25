//Função chamada toda vez que é alterado o tema para dark mode.
// --- basicamente coloca a opt = 1 se nao for dark mode e 2 se for dark mode
// --- faz uma chamada post e modifica a variável do backend para "checked" ou ""
// --- dependendo da opt passada por parâmetro. Essa darkModeVariable é passada do backend
// --- para o nunjucks.
function setDarkModeVariable(opt){
  if(opt == "")
    opt = 1;
  else
    opt = 2;
  var data = {opt};
  const options = {
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(data)
  };
  fetch('/dark-mode', options);
}

function darkModeOnOff(){
  // Pega o checkbox
  const checkBox = document.getElementById("dark-mode");  
  // Se o Checkbox está checado cai no true, se não, cai no else.
  if (checkBox.checked == true)
  {
    document.documentElement.style
    .setProperty('--background-color', 'grey');
    document.documentElement.style
    .setProperty('--white-squares', 'rgba(255, 255, 255, 0.5)');
    document.documentElement.style
    .setProperty('--font-color', 'white');

    checkBox.setAttribute("checked", "");
    setDarkModeVariable("checked");
  } 
  else 
  {
    document.documentElement.style
    .setProperty('--background-color', '#f0f0f5');
    document.documentElement.style
    .setProperty('--white-squares', 'white');
    document.documentElement.style
    .setProperty('--font-color', 'black');

    checkBox.removeAttribute("checked");
    setDarkModeVariable("");
  } 
}
    
darkModeOnOff();
