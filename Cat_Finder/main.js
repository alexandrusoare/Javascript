let list = document.querySelector('.custom-select');

let catsList = fetch('https://api.thecatapi.com/v1/breeds') //obtine lista raselor de pisici
    .then(res => res.json())
    .then(data => generateOptions(data));

function generateOptions(arr) { //genereaza optiunile intr un select
    for (var i = 0; i < arr.length; i++) {
        var option = document.createElement('option');
        option.value = arr[i].id;
        option.innerHTML = arr[i].name;
        list.appendChild(option);
    }
}

let card = document.getElementById('card');
card.style = "width:50%";
let image = document.createElement('img');

const login = { //login
    headers: {
        "x-api-key": '653e64f3-6132-4325-a713-eeba333d081e'
    }
}

//creaza imagine
generateImage(`https://api.thecatapi.com/v1/images/search?breed_ids=${list.value}`);

//genereaza imagine in functie de select
list.addEventListener("change", ()=> generateImage(`https://api.thecatapi.com/v1/images/search?breed_ids=${list.value}`)); 

function generateImage(url) {
    fetch(url, login)
        .then(res => res.json())
        .then(data => { 
            image.src = data[0].url;
            image.style = "width:100%";
            card.appendChild(image);
        }); 
}

//genereaza alta imagine daca este apasata poza
card.addEventListener('click', () => generateImage(`https://api.thecatapi.com/v1/images/search?breed_ids=${list.value}`)); 

fetch('https://api.thecatapi.com/v1/categories',login)
    .then(res => res.json())
    .then(data => generateButtons(data));

    let list_but = document.getElementById('buttons');

    
//genereaza butoane
function generateButtons(but){
    for (let i = 0; i < but.length;i++){
        let button = document.createElement('button');
        button.innerHTML= but[i].name;
        button.classList.add('btn','btn-danger');
        button.id = but[i].id;
        button.style = 'margin-right:1%';

        button.addEventListener('click', (e) => generateImagesByCategory(e.target.id))

        list_but.appendChild(button);
    }
}


function generateImagesByCategory(id){
    const images_div = document.getElementById('images');
    for (let i = 0; i < 6;i++){
        let image = document.createElement('img');
        fetch(`https://api.thecatapi.com/v1/images/search?category_ids=${id}`,login)
        .then(res => res.json())
        .then(data => image.src = data[0].url);
        images_div.appendChild(image);
    }
}





