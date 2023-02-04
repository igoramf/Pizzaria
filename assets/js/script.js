const c = (elemento) => document.querySelector(elemento);
const cs = (elemento) => document.querySelectorAll(elemento);
let cart = [];
let modalKey;
var pizzaQT = 1;
const pizzaqtHTML = c(`.pizzaInfo--qt`);

pizzaJson.map((item, idx) => {
    
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', idx)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
    pizzaItem.querySelector('.pizza-item--price').innerHTML = 'R$ ' + item.price
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        let pizzaClicked = pizzaJson[key];
        modalKey = key
        pizzaQT = 1
        
        // ADICIONAR A QUANTIDADE DE PIZZAS NO MODAL

        c('.pizzaBig img').src = pizzaClicked.img
        c('.pizzaInfo h1').innerText = pizzaClicked.name
        c('.pizzaInfo--desc').innerHTML = pizzaClicked.description
        c('.pizzaInfo--actualPrice').innerHTML = pizzaClicked.price.toFixed(2)
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, idx) => {
            if(idx == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaClicked.sizes[idx];
        })

        pizzaqtHTML.innerHTML = pizzaQT

        // EFEITO
        c(".pizzaWindowArea").style.opacity = 0;
        c(".pizzaWindowArea").style.display = 'flex';
        setTimeout(() => {
            c(".pizzaWindowArea").style.opacity = 1;
        }, 300)
        
    })

    document.querySelector('.pizza-area').append(pizzaItem);
});

// MODAL EVENTS

// CLOSE MODAL
const closeModal = () => {
    c(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => {
        c(".pizzaWindowArea").style.display = 'none';
    }, 300)
}

cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((item) => {
    item.addEventListener(`click`, (e) => closeModal())
});

// ADD AND REMOVE PIZZAS 

c(`.pizzaInfo--qtmenos`).addEventListener(`click`,(e) => {
    if(pizzaQT > 1) pizzaQT--;
    pizzaqtHTML.innerText = pizzaQT;
})

c(`.pizzaInfo--qtmais`).addEventListener(`click`,(e) => {
    pizzaQT++;
    pizzaqtHTML.innerText = pizzaQT;
})

// SELECT PIZZA SIZES
cs('.pizzaInfo--size').forEach((size, idx) => {
    size.addEventListener(`click`, (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add(`selected`);
    })
})

// CARRINHO DE COMPRAS
c(`.pizzaInfo--addButton`).addEventListener(`click`, (e) => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute(`data-key`))

    let identifier = pizzaJson[modalKey].id + `-` + size;

    let equalIndex = cart.findIndex((item) => item.identifier == identifier)
    
    if(equalIndex > -1){
        cart[equalIndex].qt += pizzaQT;
    }else{
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: pizzaQT
        })
    }
    updateCart();
    closeModal();
})


c(`.menu-openner`).addEventListener(`click`, (e) => {
    if(cart.length > 0 ){
        c(`aside`).style.left = '0';
    }else{
        c(`aside`).style.left = `100vw`
    }
})

c(`.menu-closer`).addEventListener(`click`, () => {
    c(`aside`).style.left = `100vw`;
})


const updateCart = () => {
    c(`.menu-openner span`).innerHTML = cart.length;

    if(cart.length > 0){
        c(`aside`).classList.add(`show`);
        c(`.cart`).innerHTML = ``;

        let subTotal = 0;
        let desconto = 0;
        let total = 0;

        
        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            let cartItem = c(`.models .cart--item`).cloneNode(true);
            
            subTotal += pizzaItem.price * cart[i].qt;


            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = `P`;
                    break;
                case 1:
                    pizzaSizeName = `M`;
                    break;
                case 2:
                    pizzaSizeName = `G`;
                    break;
            }


            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector(`img`).src = pizzaItem.img
            cartItem.querySelector(`.cart--item-nome`).innerHTML = pizzaName;
            cartItem.querySelector(`.cart--item--qt`).innerHTML = cart[i].qt;
            cartItem.querySelector(`.cart--item-qtmenos`).addEventListener(`click`, (e) => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else{
                    cart.splice(i, 1);
                }
                updateCart();
            })

            cartItem.querySelector(`.cart--item-qtmais`).addEventListener(`click`, (e) => {
                cart[i].qt++;
                updateCart();
            }) 

            c(`.cart`).append(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c(`.subtotal span:last-child`).innerHTML = `R$ ${subTotal.toFixed(2)}`;
        c(`.desconto span:last-child`).innerHTML = `R$ ${desconto.toFixed(2)}`;
        c(`.total span:last-child`).innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c(`aside`).classList.remove(`show`);
        c(`aside`).style.left = `100vw`;
    }
}