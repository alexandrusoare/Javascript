// sursa de date pe care o primim impreuna cu imaginile din directorul img
const images = [
    { "src": "img1.jpg", "alt": "1 Nature" },
    { "src": "img2.jpg", "alt": "2 Fjords" }, 
    { "src": "img3.jpg", "alt": "3 Mountains" },
    { "src": "img4.jpg", "alt": "4 Lights" }
];

let index = 0;
//afiseaza imaginea curenta
function showImage(i){
    var image = document.getElementById('slide');
    image.src = 'img/' + images[i].src;
    image.title = images[i].alt;
    index = i;
    }
showImage(index);

//trece la poza urmatoare
var next = document.getElementById('inainte');
next.addEventListener('click', (ev)=> {
    if (index == images.length - 1){
    index = -1;
    showImage(++index);
    document.getElementById(images.length - 1).classList.remove('activ');
    document.getElementById(index).classList.add('activ');
    }
    else{
    showImage(++index);
    document.getElementById(index-1).classList.remove('activ');
    document.getElementById(index).classList.add('activ');}
});

//trece la imaginea precedenta
var left = document.getElementById('inapoi');
left.addEventListener('click', (ev)=>{
    if (index == 0){
    index = images.length;
    showImage(--index);
    document.getElementById(0).classList.remove('activ');
    document.getElementById(images.length - 1).classList.add('activ')
    }
    else{
    showImage(--index);
    document.getElementById(index + 1).classList.remove('activ');
    document.getElementById(index).classList.add('activ');}
});


//meniu bilute
function meniuBilute(index){
    var meniu = document.getElementById('meniu');
    for (var i = 0; i < images.length;i++){
        let biluta = document.createElement('span');
        biluta.className="biluta";
        biluta.id= i;
        biluta.title = images[i].alt;

        if (index == i)
        biluta.classList.add('activ');
        meniu.appendChild(biluta);
        //afisare poza in functie de biluta
        biluta.addEventListener('click',(ev)=>{
            var activ = document.getElementsByClassName('activ');
            activ[0].classList.remove('activ');
            biluta.classList.add('activ');
            showImage(biluta.id);
            index = biluta.id;
        })
    }
}

meniuBilute(index);



    