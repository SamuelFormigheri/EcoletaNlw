const ulSquares = document.querySelector('ul.squares');

for(let i = 0; i < 12; i++){
    const li = document.createElement('li');

    const size = Math.floor(Math.random() * 200);
    const position = Math.floor(Math.random() * 100);
    const delay = Math.random() * 2;
    const duration = Math.random() * 5;
    const border = Math.random() * 50;

    li.style.width = `${size}px`;
    li.style.height = `${size}px`;
    li.style.bottom = `-${size}px`;
    li.style.borderRadius = `${border}px`;

    li.style.left = `${position}%`;
  
    li.style.animationDelay = `${delay}s`;
    li.style.animationDuration = `${duration + 1}s`;
    li.style.animationTimingFunction = `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`;
  
    ulSquares.appendChild(li);
}