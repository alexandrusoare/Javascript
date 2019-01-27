/**
 * Endpoint-uri Dog API:
 * imagine random: https://dog.ceo/api/breeds/image/random
 * toate rasele: https://dog.ceo/api/breeds/list
 * imagine random dintr-o rasa anume: https://dog.ceo/api/breed/{hound}/images/random
 */

// ------------------------------------------
//  Referinte la Elementele HTML pe care le vom folosi in cod
// ------------------------------------------

const select = document.getElementById('breeds');
const card = document.querySelector('.card'); 
const form = document.querySelector('form');


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

// PAS 1: exploreaza in consola un response HTTP de la server:
//   - functionalitatea de baza a metodei fetch(), 
//   - cum gestionam un Response cu metoda .then(),
//   - parsarea unui string JSON cu metoda Response.json()   




// PAS 2: obtine o imagine random (https://dog.ceo/api/breeds/image/random) 
// Apeleaza functia generateImage(), care afiseaza raspunsul in <div>  
 var random = fetch('https://dog.ceo/api/breeds/image/random').then((res)=> res.json()).then((data)=>generateImage(data.message));

function generateImage(url){
    var image = document.createElement('img');
    image.src = url;
    card.appendChild(image);
    var check = document.querySelectorAll('.card img');
    if (check.length > 1)
        card.removeChild(check[0]);
}




// PAS 3: obtine o lista de rase de caini (https://dog.ceo/api/breeds/list)
// Apeleaza functia generateOptions(), care afiseaza raspunsul in <select> 
var dogList = fetch('https://dog.ceo/api/breeds/list').then((res)=> res.json()).then((data)=>generateOptions(data.message));

function generateOptions(list){
    for (var i = 0; i < list.length;i++){
        var option = document.createElement('option');
        option.value = list[i];
        option.innerHTML = list[i];
        select.appendChild(option);
    }
}

// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------

// PAS 4: la schimbarea optiunii din <select> afiseaza o imagine din rasa selectata
select.addEventListener('change',()=> {
    var race = select.value;
    console.log(race);
    fetch(`https://dog.ceo/api/breed/${race}/images/random`).then((res) => res.json()).then((data) =>generateImage(data.message));
} )

card.addEventListener('click',()=>{
    var race = select.value;
    fetch(`https://dog.ceo/api/breed/${race}/images/random`).then((res) => res.json()).then((data) =>generateImage(data.message));
})

// PAS 5: la click in interiorul <div>-ului afiseaza alta imagine din rasa selectata

// PAS 6: Creati o functie fetchData(url) care sa automatizeze primii doi pasi dintr-un request 
// (trimiterea request-ului si parsarea raspunsului JSON)

function fetchData(url){
    fetch(url).then((res)=> res.json())
    .then((data) => generateImage(data.message))
    .catch(Show);
}

// PAS 7 - atasati cu metoda .catch() un handler care sa afiseze in consola un mesaj custom de eroare 
// si eroarea primita de la server. Ca sa va asigurati ca functioneaza, schimbati url-ul catre care
// trimiteti request-ul cu unul gresit.
    function Show(error){
        alert(`Error: ${error}`);
    }



// PAS 8 - integrati primele doua comenzi .fetch() intr-o singura comanda Promise.all()



// ------------------------------------------
//  POST DATA
// ------------------------------------------


// PAS 9 - Transmiteti datele completate in formular printr-un request POST, catre https://jsonplaceholder.typicode.com/posts 
// Printati in consola raspunsul primit de la server, impreuna cu un mesaj custom.  

 const namev = document.getElementById('name');
 const commentv = document.getElementById('comment');
 const submit = document.getElementById('submit');



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



// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

// generateImage(src, alt)
// Functie custom, care afiseaza o imagine in interiorul <div>-ului  


// generateOptions(data)
// Functie custom, care completeaza optiunile din <select>


