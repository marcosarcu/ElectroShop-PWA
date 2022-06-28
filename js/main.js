if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("./sw.js")
            .then(function (registration) {
                console.log("SW registrado correctamente", registration);
            }, function (err) {
                console.log("SW no se pudo registrar", err);
            });
    });
}


window.addEventListener('DOMContentLoaded', function () {

    fetch('./data/articles.json')
        .then(response => response.json())
        .then(jsonArticles => {
            const listado = document.getElementById('listado');

            jsonArticles.forEach(article => {
                // Crear wrapper
                const wrapper = document.createElement('div');
                wrapper.classList.add("col-12", "col-md-6", "mt-3", "mb-3");
                // Crear Article
                const articleElement = document.createElement('article');
                articleElement.classList.add('card');
                // Crear Imagen
                const img = document.createElement('img');
                img.classList.add('card-img-top');
                img.src = './imgs/' + article.img;
                img.alt = article.img_desc;
                // Crear card-body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                // Crear h3
                const cardTitle = document.createElement('h3');
                cardTitle.classList.add('card-title');
                cardTitle.innerHTML = article.name;
                // Crear p
                const cardText = document.createElement('p');
                cardText.classList.add('card-text', "precio", "align-center");
                cardText.innerHTML = '$ ' + article.precio;
                // Crear boton
                const btn = document.createElement('a');
                btn.classList.add('btn', 'btn-primary', 'button');
                btn.dataset.id = article.id;
                btn.innerHTML = 'Ver Detalle';
                // Personalizar el modal de detalle
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const id = e.target.dataset.id;
                    const article = jsonArticles.find(article => article.id === id);
                    const modal = document.getElementById('modal');
                    const modalImg = document.getElementById('modal-img');
                    const modalTitle = document.getElementById('modal-title');
                    const modalText = document.getElementById('modal-text');
                    const modalPrice = document.getElementById('modal-price');
                    const modalBtn = document.getElementById('modal-btn');
                    modalImg.src = './imgs/' + article.img;
                    modalImg.alt = article.img_desc;
                    modalTitle.innerHTML = article.name;
                    modalText.innerHTML = article.description;
                    modalPrice.innerHTML = '$ ' + article.precio;
                    modalBtn.dataset.id = article.id;

                    // Función a ejecutarse al clickar el boton de comprar
                    let modalBtnEvent = function (e) {
                        e.preventDefault();
                        modal.classList.remove('show');
                        const id = e.target.dataset.id;
                        const currentArticle = jsonArticles.find(article => article.id === id);
                        // Simulo compra
                        console.log('Compraste ' + currentArticle.name);
                        // Guardo en localStorage
                        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                        if (cart.find(article => article.id === id)) {
                            const index = cart.findIndex(article => article.id === id);
                            cart[index].cantidad += 1;
                        } else {
                            currentArticle.cantidad = 1;
                            cart.push(currentArticle);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        // Actualizo el carrito
                        updateCart();
                        // Informo al usuario
                        new Toast({
                            message: 'Agregado al carrito',
                            type: 'success',
                            customButtons: [
                                {
                                    text: 'Ver Carrito',
                                    onClick: () => {abrirCarrito()}
                                }
                            ]
                        });
                        // Elimino el evento
                        modalBtn.removeEventListener('click', modalBtnEvent);
                    }

                    modalBtn.addEventListener('click', modalBtnEvent);


                    modal.classList.add('show');
                })

                // Agregar hijos
                articleElement.appendChild(img);
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardBody.appendChild(btn);
                articleElement.appendChild(cardBody);
                wrapper.appendChild(articleElement);
                listado.appendChild(wrapper);
            });

            // Actualizar carrito
            const updateCart = function () {
                const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                if(!cart.length > 0){
                    const cartList = document.querySelector('.cart-list');
                    cartList.innerHTML = '<p>No hay productos en el carrito</p>';
                    cartIcon = document.querySelector('#cart-icon');
                    cartIcon.className = 'bi bi-bag cart-btn fs-2';
                    const cantidadCarrito = document.querySelector('#carrito-cantidad');
                    cantidadCarrito.style.display = 'none';
                    const cartFooter = document.querySelector('.cart-footer');
                    cartFooter.setAttribute('style', 'display: none');
                    
                }
                if (cart.length > 0) {
                    cartIcon = document.querySelector('#cart-icon');
                    cartIcon.className = 'bi bi-bag-fill cart-btn fs-2';
                    const cantidadCarrito = document.querySelector('#carrito-cantidad');
                    cantidadCarrito.style.display = 'block';
                    cantidadCarrito.firstChild.innerHTML = cart.length;
                    const cartFooter = document.querySelector('.cart-footer');
                    cartFooter.setAttribute('style', 'display: flex');
                    // Crear el carrito
                    const cartList = document.querySelector('.cart-list');
                    cartList.innerHTML = "";
                    cart.forEach(article => {
                        // li
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        // boton de eliminar
                        const btnDlt = document.createElement('button');
                        btnDlt.classList.add('btn', 'btn-danger', 'btn-sm', 'float-right', 'mt-4', 'mb-2');
                        btnDlt.innerHTML = '<i class="bi bi-trash3"></i><span class="d-none  d-md-inline"> Eliminar</span>';
                        // btnDlt.innerHTML = '';
                        btnDlt.dataset.id = article.id;
                        btnDlt.addEventListener('click', function (e) {
                            // console.log(e.currentTarget)
                            e.preventDefault();
                            const id = e.currentTarget.dataset.id;
                            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                            const index = cart.findIndex(cartItem => cartItem.id === id);
                            cart.splice(index, 1);
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCart();
                        });
                        
                        // Img
                        const img = document.createElement('img');
                        img.src = './imgs/' + article.img;
                        img.alt = article.img_desc;
                        // Nombre
                        const nombre = document.createElement('h3');
                        nombre.innerHTML = article.name;
                        // Precio por unidad
                        const precio = document.createElement('div');
                        precio.innerHTML = 'Precio Unitario: $ ' + article.precio;
                        // quantity input
                        const label = document.createElement('label');
                        label.classList.add('cart-label');
                        label.innerHTML = 'Cantidad:';
                        label.setAttribute('for', 'cantidad');
                        const cantidad = document.createElement('input');
                        cantidad.classList.add('mb-2', 'mt-2');
                        cantidad.id = 'cantidad';
                        cantidad.dataset.id = article.id;
                        cantidad.type = 'number';
                        cantidad.value = article.cantidad;
                        cantidad.min = 1;
                        cantidad.max = 10;
                        cantidad.addEventListener('change', function (e) {
                            e.preventDefault();
                            const id = e.target.dataset.id;
                            const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                            // Actualizo la cantidad
                            const index = cart.findIndex(article => article.id === id);
                            cart[index].cantidad = e.target.value;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            updateCart();

                        });
                        // Total
                        const total = document.createElement('div');
                        total.classList.add('precio', 'mb-2');
                        total.innerHTML = '$ ' + (article.precio * article.cantidad).toLocaleString("ES-AR");
                        //form-row
                        const formRow = document.createElement('div');
                        formRow.classList.add('form-row');
                        formRow.appendChild(label);
                        formRow.appendChild(cantidad);

                        // Armar Body
                        const div = document.createElement('div');
                        div.classList.add('cart-item-info');
                        div.appendChild(nombre);
                        div.appendChild(total);
                        div.appendChild(formRow);
                        div.appendChild(precio);
                        div.appendChild(btnDlt);
                        //Appends
                        li.appendChild(img);
                        li.appendChild(div);
                        cartList.appendChild(li);
                    });
                    // Crear el total
                    const total = document.querySelector('#total');
                    total.innerHTML = '<b>Total:</b><br> $' + cart.reduce((total, article) => total + article.precio * article.cantidad, 0).toLocaleString("ES-AR");
                }
            }

            updateCart();

            // Crear el boton de comprar
            const comprar = (e) =>{
                e.preventDefault();
                new Toast({
                    message: 'Compra realizada con exito',
                    type: 'success',
                    
                });
                localStorage.removeItem('cart');
                updateCart();
            } 
            const btnComprar = document.querySelector('#comprar');
            btnComprar.classList.add('show');
            btnComprar.addEventListener('click', comprar);

        });

    
    


    // Cerrar modal
    const closeModal = document.getElementById('close-modal');
    closeModal.addEventListener('click', function (e) {
        e.preventDefault();
        const modal = document.getElementById('modal');
        modal.classList.remove('show');
    });

    // Abrir Carrito

    let abrirCarrito = () => {
        let offCanvas = document.getElementById("cart")
        let newOffCanvas = new bootstrap.Offcanvas(offCanvas)
        newOffCanvas.toggle()
    }

    // Pedir instalacion

    let mostrarBotonInstallar = () => {
        setTimeout(() => {
            new Toast({
                message: '¡Instalá la app de ElectroShop!',
                type: 'success',
                customButtons: [
                    {
                        text: 'Instalar',
                        onClick: () => {instalarApp()}
                    }
                ]
            });
        }, 5000)
    };

    let eventInstall;
    
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        eventInstall = e;
        mostrarBotonInstallar();
        //console.log(e);
    })
    
    let instalarApp = () => {
        if(eventInstall){
            eventInstall.prompt();
            eventInstall.userChoice.then(choice => {
                if(choice.outcome === 'accepted'){
                    new Toast({
                        message: '¡Gracias por instalar la app!',
                        type: 'success'
                    });
                }
            });
        }
    }


    // Notificaciones

    if (this.window.Notification && Notification.permission !== "denied") {
        setTimeout(() => {
            Notification.requestPermission()
                .then(res => console.log(res))
        }, 10000);
    }

    // Online/Offline
    window.addEventListener('online', function () {
        new Toast({
            message: 'Estás conectado a Internet',
            type: 'success'
        });
    });
    window.addEventListener('offline', function () {
        new Toast({
            message: 'No hay conexión a Internet',
            type: 'error'
        });
    });

    // Share
    const share = document.getElementById('share');
    share.addEventListener('click', function (e) {
        e.preventDefault();
        navigator.share({
            url: 'https://pwa-marcosarcu.netlify.app/',
            title: 'ElectroShop',
            text: 'Comprá electronica al mejor precio.',
        })
    })

});