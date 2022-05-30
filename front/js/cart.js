// Récupération de l'id des produits grâce à une fonction asynchrone

async function init() {
    product = await getProductById();
    console.log(product)
}

let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
function getProductById() {
    const params = new URL(document.location).searchParams;
    const id = params.get('id');
    console.log(id);
    return (
        fetch("http://localhost:3000/api/products/${id}" + id)
            .then((res) => res.json())
            .then((data) => {
                console.log('data', data);
                return data
            })
            .catch((data) => {
                return error;
            })
    );
}
// Bouton pour commander:


// Dans le cas où le panier est vide :
const positionEmptyCart = document.querySelector("#cart__items");

if (localStorage.getItem('orderId') != null) {
    document.getElementById('orderId').innerHTML = `<p>` + localStorage.getItem('orderId')
    localStorage.clear()
}
function getCart() {
    if (produitLocalStorage === null || produitLocalStorage == 0) {
        const emptyCart = `<p>Votre panier est vide.</p>`;
        positionEmptyCart.innerHTML = emptyCart;
    } else {
        // ici je crée une boucle et je récupère/crée les éléments du document html
        for (let produit in produitLocalStorage) {

            let article = document.createElement("article");
            document.querySelector("#cart__items").appendChild(article);
            article.className = "cart__item";
            article.setAttribute('data-id', produitLocalStorage[produit].id);

            let itemImg = document.createElement("div");
            article.appendChild(itemImg);
            itemImg.className = "cart__item__img";

            let image = document.createElement("img");
            itemImg.appendChild(image);
            image.src = produitLocalStorage[produit].imgProduit;
            image.alt = produitLocalStorage[produit].altImgProduit;

            let itemContent = document.createElement("div");
            article.appendChild(itemContent);
            itemContent.className = "cart__item__content";

            let itemDescription = document.createElement("div");
            itemContent.appendChild(itemDescription);
            itemDescription.className = "cart__item__content__description";

            let title = document.createElement("h2");
            itemDescription.appendChild(title);
            title.innerHTML = produitLocalStorage[produit].nomProduit;

            let colors = document.createElement("p");
            title.appendChild(colors);
            colors.innerHTML = produitLocalStorage[produit].couleurProduit;

            let price = document.createElement("p");
            itemDescription.appendChild(price);
            price.innerHTML = produitLocalStorage[produit].prixProduit + ("€");

            let contentSettings = document.createElement("div");
            article.appendChild(contentSettings);
            contentSettings.className = "cart__item__content__settings";

            let settingsQuantity = document.createElement("div");
            contentSettings.appendChild(settingsQuantity);
            settingsQuantity.className = "cart__item__content__settings__quantity";

            let quantity = document.createElement("p");
            settingsQuantity.appendChild(quantity);
            quantity.innerHTML = "Qté : ";

            let nmbrQuantity = document.createElement("input");
            settingsQuantity.appendChild(nmbrQuantity);
            quantity.value = produitLocalStorage[produit].quantiteProduit;
            quantity.className = "itemQuantity";
            quantity.setAttribute("type", "number");
            quantity.setAttribute("min", "1");
            quantity.setAttribute("max", "100");
            quantity.setAttribute("name", "itemQuantity");

            let suppItem = document.createElement("div");
            contentSettings.appendChild(suppItem);
            suppItem.className = "cart__item__content__settings__delete";

            let dltItem = document.createElement("p");
            suppItem.appendChild(dltItem);
            dltItem.className = "deleteItem";
            dltItem.innerHTML = "Supprimer";
        }
    }
}
getCart();

//Je récupère le total des produits

function getTotals() {
    var itemQtt = document.getElementsByClassName('itemQuantity');
    var qttLength = itemQtt.length,
        totalQtt = 0;

    for (var i = 0; i < qttLength; ++i) {
        totalQtt += itemQtt[i].valueAsNumber;
    }

    let itemTotalQuantity = document.getElementById('totalQuantity');
    itemTotalQuantity.innerHTML = totalQtt;
    console.log(totalQtt);

    // Je récupère le prix total

    totalPrice = 0;

    for (var i = 0; i < qttLength; ++i) {
        totalPrice += (itemQtt[i].valueAsNumber * produitLocalStorage[i].prixProduit);
    }

    let totalPriceItems = document.getElementById('totalPrice');
    totalPriceItems.innerHTML = totalPrice;
    console.log(totalPrice);
}
getTotals();

// Si l'on modifie les quantités de produits :

function qttModify() {
    let modifierQtt = document.querySelectorAll('itemQuantity');

    for (let k = 0; k < modifierQtt.length; k++) {
        modifierQtt[k].addEventListener("change", (event) => {
            event.preventDefault();

            let modificationQtt = produitLocalStorage[k].quantiteProduit;
            let qttModifValue = modifierQtt[k].valueAsNumber;

            const resultFind = produitLocalStorage.find((el) => el.qttModifValue !== modificationQtt);
            resultFind.quantiteProduit = qttModifValue;
            produitLocalStorage[k].quantiteProduit = resultFind.quantiteProduit;

            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
            location.reload();
        })
    }
}
qttModify();

// Supprimer un produit

function deleteItem() {
    let dltBtn = document.querySelectorAll(".deleteItem");

    for (let j = 0; j < dltBtn.length; j++) {
        dltBtn[j].addEventListener("click", (event) => {
            event.preventDefault();

            let idDelete = produitLocalStorage[j].idProduit;
            let colorDelet = produitLocalStorage[j].couleurProduit;
            produitLocalStorage = produitLocalStorage.filter((el) => el.idProduit !== idDelete || el.couleurProduit !== colorDelet);

            localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

            // Alerte lorsque le produit est supprimé :
            alert("Ce produit a bien été supprimé de votre panier");
            location.reload();
        })
    }
}
deleteItem();

//Insertion du formulaire avec les expressions régulières :
function getForm() {
    let form = document.querySelector(".cart__order__form");
    let mail = new RegExp("^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$");
    let characters = new RegExp("^[a-zA-Z ,.'-]+$");
    let address = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

    // Ecoute des modifications des éléments du form:
    form.firstName.addEventListener('change', function () {
        validFirstName(this);
    });
    form.lastName.addEventListener('change', function () {
        validLastName(this);
    });
    form.address.addEventListener('change', function () {
        validAddress(this);
    });
    form.city.addEventListener('change', function () {
        validCity(this);
    });
    form.email.addEventListener('change', function () {
        validEmail(this);
    });

    // Validation des éléments du form:
    const validFirstName = function (inputFirstName) {
        let firstNameAlertError = inputFirstName.nextElementSibling;
        if (characters.test(inputFirstName.value)) {
            firstNameAlertError.innerHTML = '';
        } else {
            firstNameAlertError.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
    const validLastName = function (inputLastName) {
        let lastNameAlertError = inputLastName.nextElementSibling;
        if (characters.test(inputLastName.value)) {
            lastNameAlertError.innerHTML = '';
        } else {
            lastNameAlertError.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
    const validAddress = function (inputAddress) {
        let addressAlertError = inputAddress.nextElementSibling;
        if (characters.test(inputAddress.value)) {
            addressAlertError.innerHTML = '';
        } else {
            addressAlertError.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
    const validCity = function (inputCity) {
        let cityAlertError = inputCity.nextElementSibling;
        if (characters.test(inputCity.value)) {
            cityAlertError.innerHTML = '';
        } else {
            cityAlertError.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
    const validEmail = function (inputEmail) {
        let emailAlertError = inputEmail.nextElementSibling;
        if (characters.test(inputEmail.value)) {
            emailAlertError.innerHTML = '';
        } else {
            emailAlertError.innerHTML = 'Veuillez renseigner ce champ.';
        }
    };
}
getForm();