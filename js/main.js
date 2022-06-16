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
        .then(response =>  response.json())
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
                    let modalBtnEvent = function(e){
                        e.preventDefault();
                        modal.classList.remove('show');
                        const id = e.target.dataset.id;
                        const currentArticle = jsonArticles.find(article => article.id === id);
                        // Simulo compra
                        console.log('Compraste ' + currentArticle.name);
                        // Guardo en localStorage
                        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                        cart.push(currentArticle.id);
                        localStorage.setItem('cart', JSON.stringify(cart));
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
        });

        // Cerrar modal
        const closeModal = document.getElementById('close-modal');
        closeModal.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = document.getElementById('modal');
            modal.classList.remove('show');
        });
});


