//obtine referinte
const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');


//genereaza o imagine random cu un caine
 var random = fetch('https://dog.ceo/api/breeds/image/random').then((res)=> res.json()).then((data)=>generateImage(data.message));

function generateImage(url){
    var image = document.createElement('img');
    image.src = url;
    card.appendChild(image);
    var check = document.querySelectorAll('.card img');
    if (check.length > 1)
        card.removeChild(check[0]);
}


//genereaza lista cu rase de caini
var dogList = fetch('https://dog.ceo/api/breeds/list').then((res)=> res.json()).then((data)=>generateOptions(data.message));

function generateOptions(list){
    for (var i = 0; i < list.length;i++){
        var option = document.createElement('option');
        option.value = list[i];
        option.innerHTML = list[i];
        select.appendChild(option);
    }
}

//afiseaza o imagine cu un caine in functie de rasa selectata
select.addEventListener('change',()=> {
    var race = select.value;
    fetchData(`https://dog.ceo/api/breed/${race}/images/random`);
} )

//afiseaza o alta imagine cu acelasi caine daca este apasata poza
card.addEventListener('click',()=>{
    var race = select.value;
    fetchData(`https://dog.ceo/api/breed/${race}/images/random`);
})

//simplificarea fetchului
function fetchData(url){
    fetch(url).then((res)=> res.json())
    .then((data) => generateImage(data.message))
    .catch(Show);
}

function Show(error){
        alert(`Error: ${error}`);
    }

 const namev = document.getElementById('name');
 const commentv = document.getElementById('comment');
 const submit = document.getElementById('submit');


//trimite
 submit.addEventListener('click', (e)=>{
     e.preventDefault();
     var data ={
         name : namev.value,
         comment : commentv.value
     }
     fetch('https://jsonplaceholder.typicode.com/posts',{
         method:'POST',
         body: JSON.stringify(data),
         headers:{
            'Content-Type': 'application/json'
          }
     }).then(res => res.json())
     .then(response => console.log('Success:',response))
     .catch(error => console.error('Error:', error));
 })






