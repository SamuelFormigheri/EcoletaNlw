function darkModeOnOff(){
  // ´Pega o checkbox
  const checkBox = document.getElementById("dark-mode");

  // Se o Checkbox está checado cai no true, se não, cai no else.
  if (checkBox.checked == true)
  {
    document.documentElement.style
    .setProperty('--background-color', 'grey');
    document.documentElement.style
    .setProperty('--white-squares', 'rgba(255, 255, 255, 0.5)');

    checkBox.setAttribute("checked", "");
    // {% set darkModeVariable = "checked"; %}
  } 
  else 
  {
    document.documentElement.style
    .setProperty('--background-color', '#f0f0f5');
    document.documentElement.style
    .setProperty('--white-squares', 'white');

    //{% set darkModeVariable = "" %}
    checkBox.removeAttribute("checked");
  }
}

darkModeOnOff();