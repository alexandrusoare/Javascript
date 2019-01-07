//referinte
const list = document.getElementById('lista');
const add = document.getElementById('add');
const input = document.getElementById('shop');
const final_list = document.getElementById('fin');

add.addEventListener('click',addElement);
input.addEventListener('keypress',function(ev){
    if (ev.key === "Enter"){
    addElement();
    }
})

//functie care adauga un element in lista
function addElement(){
    if (input.value == '')
    return;
    //creaza element de tip li
    let item = document.createElement('li');
    item.classList.add('mb-4');

    //creaza element de tip span
    let span = document.createElement('span');
    span.textContent = input.value;
    span.classList.add('mr-3')

    //creaza butonul de edit
    let edit = document.createElement('button');
    edit.innerHTML='Edit';
    edit.classList.add('mr-2');

    //creaza butonul de delete
    let del = document.createElement('button');
    del.innerHTML='Delete';
    del.classList.add('mr-2')

    //creaza butonul de submit
    let submit = document.createElement('button');
    submit.innerHTML='Submit';
    submit.classList.add('mr-2');

    //adauga elementul in lista
    item.appendChild(span);
    item.appendChild(edit);
    item.appendChild(del);
    item.appendChild(submit);
    list.appendChild(item);
    input.value='';

    //editeaza un element din lista
    edit.addEventListener('click',()=>{
        span.style.display ='none';
        edit.style.display = 'none';
        let new_input = document.createElement('input');
        item.insertBefore(new_input,edit);
        new_input.value = span.textContent;
        new_input.classList.add('mr-3');
        new_input.addEventListener('keyup',(e)=>{
            if (e.key === 'Enter'){
                span.textContent = new_input.value;
                span.style.display = 'inline';
                edit.style.display = 'inline';
                item.removeChild(new_input);
            }
        })
    })

        //sterge un element
    del.addEventListener('click',(event)=>{
        list.removeChild(event.target.parentNode);
    })

        //trimite catre lista finala
    submit.addEventListener('click',()=>{
        let final_item = document.createElement('li');
        final_item.innerText = span.textContent;
        final_list.appendChild(final_item);
        list.removeChild(item); 
    })
    
}

