let list = document.querySelector('.custom-select');

let catsList = fetch('https://api.thecatapi.com/v1/breeds')
    .then(res => res.json())
    .then(data => generateOptions(data));

    function generateOptions(arr){
        for (var i = 0; i < arr.length;i++){
            var option = document.createElement('option');
            option.value = arr[i].name;
            option.innerHTML = arr[i].name;
            list.appendChild(option);
        }
    }

let card = document.getElementById('card');
let image = document.createElement('img');
