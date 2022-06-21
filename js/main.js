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
                        if(cart.find(article => article.id === id)) {
                            const index = cart.findIndex(article => article.id === id);
                            cart[index].cantidad += 1;
                        } else{
                            currentArticle.cantidad = 1;
                            cart.push(currentArticle);
                        }
                        localStorage.setItem('cart', JSON.stringify(cart));
                        // Actualizo el carrito
                        updateCart();
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
                if (cart.length > 0) {
                    // Crear el carrito
                    const cartList = document.querySelector('.cart-list');
                    cartList.innerHTML = "";
                    cart.forEach(article => {
                        // const article = jsonArticles.find(article => article.id === id);
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        const img = document.createElement('img');
                        img.src = './imgs/' + article.img;
                        img.alt = article.img_desc;
                        const p = document.createElement('p');
                        p.innerHTML = article.name;
                        const precio = document.createElement('p');
                        precio.innerHTML = '$ ' + article.precio;
                        const cantidad = document.createElement('p');
                        cantidad.innerHTML = 'Cantidad: ' + article.cantidad;
                        const total = document.createElement('p');
                        total.innerHTML = 'Total: $ ' + article.precio * article.cantidad;
                        li.appendChild(img);
                        li.appendChild(p);
                        li.appendChild(precio);
                        li.appendChild(cantidad);
                        li.appendChild(total);
                        cartList.appendChild(li);
                    });
                    // Crear el total
                    const total = document.querySelector('#total');
                    total.innerHTML = 'Total: $ ' + cart.reduce((total, article) => total + article.precio * article.cantidad, 0);

                    // Crear el boton de comprar
                    const btnComprar = document.querySelector('#comprar');
                    btnComprar.classList.add('show');
                    btnComprar.addEventListener('click', function (e) {
                        e.preventDefault();
                        localStorage.removeItem('cart');
                        updateCart();
                        window.location.href = './index.html';
                    });
                }
            }

            updateCart();

        });

    // Cerrar modal
    const closeModal = document.getElementById('close-modal');
    closeModal.addEventListener('click', function (e) {
        e.preventDefault();
        const modal = document.getElementById('modal');
        modal.classList.remove('show');
    });


    // Notificaciones

    if(this.window.Notification && Notification.permission !== "denied") {
        setTimeout(() => {
            Notification.requestPermission()
                .then(res =>  console.log(res))
        }, 10000);
    }

    // Online/Offline
    window.addEventListener('online', function () {
        new Toast({message: 'Estás conectado a Internet', type: 'success'});
    });
    window.addEventListener('offline', function () {
        new Toast({message: 'No hay conexión a Internet', type: 'error'});
    });

    //Share
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
