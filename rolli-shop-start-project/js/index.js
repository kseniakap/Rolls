async function getProduct() {
  const response = await fetch("./js/data.json");
  const productArray = await response.json();
  renderFunction(productArray);
}

getProduct();

//Render products

function renderFunction(array) {
  const productContainer = document.querySelector("#products__container");
  array.forEach((item) => {
    const product = `
    <div class="col-md-6">
      <div class="card mb-4" data-id=${item.id}>
        <img class="product-img" src=${item.imgSrc} alt=${item.title}>
        <div class="card-body text-center">
          <h4 class="item-title">${item.title}</h4>
          <p><small data-items-in-box class="text-muted">${item.amount} шт.</small></p>
          <div class="details-wrapper">
            <div class="items counter-wrapper">
              <div class="items__control" data-action="minus">-</div>
              <div class="items__current" data-counter>1</div>
              <div class="items__control" data-action="plus">+</div>
            </div>
            <div class="price">
              <div class="price__weight">${item.weight}г.</div>
              <div class="price__currency">${item.price}₽</div>
            </div>
          </div>
          <button data-cart type="button" class="btn btn-block btn-outline-warning">+ в корзину</button>
        </div>
      </div>
    </div>
  `;
    productContainer.insertAdjacentHTML("beforeend", product);
  });
}

const cartWrapper = document.querySelector(".cart-wrapper");

// Counter

window.addEventListener("click", (e) => {
  try {
    const counterWrapper = e.target.closest(".counter-wrapper");
    const counter = counterWrapper.querySelector("[data-counter]");

    if (e.target.dataset.action === "plus") {
      counter.innerHTML = ++counter.innerHTML;
    }

    if (e.target.dataset.action === "minus") {
      if (parseInt(counter.innerHTML) > 1) {
        counter.innerHTML = --counter.innerHTML;
      } else if (
        e.target.closest(".cart-wrapper") &&
        parseInt(counter.innerHTML) === 1
      ) {
        e.target.closest(".cart-item").remove();
        countTotalPriceAndDelivery();
        toggleCartStatus();
      }
    }
    if (
      e.target.hasAttribute("data-action") &&
      e.target.closest(".cart-wrapper")
    ) {
      countTotalPriceAndDelivery();
    }
  } catch (e) {}
});

// Add cart in box

window.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-cart")) {
    const card = e.target.closest(".card");

    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerHTML,
      itemsInBox: card.querySelector("[data-items-in-box]").innerHTML,
      weight: card.querySelector(".price__weight").innerHTML,
      price: card.querySelector(".price__currency").innerHTML,
      counter: card.querySelector("[data-counter]").innerHTML,
    };

    const itemCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);

    if (itemCart) {
      const counterElem = itemCart.querySelector("[data-counter]");
      counterElem.innerHTML =
        parseInt(counterElem.innerHTML) + parseInt(productInfo.counter);
    } else {
      const cardItem = ` 
        <div class="cart-item" data-id=${productInfo.id}>
            <div class="cart-item__top">
                <div class="cart-item__img">
                    <img src=${productInfo.imgSrc} alt="">
                </div>
                <div class="cart-item__desc">
                    <div class="cart-item__title">${productInfo.title}</div>
                    <div class="cart-item__weight">.${productInfo.itemsInBox} / ${productInfo.weight}</div>
                    <div class="cart-item__details">
                        <div class="items items--small counter-wrapper">
                            <div class="items__control" data-action="minus">-</div>
                            <div class="items__current" data-counter="">${productInfo.counter}</div>
                            <div class="items__control" data-action="plus">+</div>
                        </div>
                        <div class="price">
                            <div class="price__currency">${productInfo.price}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

      cartWrapper.insertAdjacentHTML("beforeend", cardItem);

      toggleCartStatus();
    }
    countTotalPriceAndDelivery();
    card.querySelector("[data-counter]").innerHTML = "1";
  }
});

//ToggleCartStatus

function toggleCartStatus() {
  const childCounter = document.querySelectorAll(".cart-item").length;
  const emptyBox = document.querySelector("[data-cart-empty]");
  const orderForm = document.querySelector("#order-form");

  if (childCounter > 0) {
    emptyBox.classList.add("none");
    orderForm.classList.remove("none");
  } else if (childCounter <= 0) {
    emptyBox.classList.remove("none");
    orderForm.classList.add("none");
  }
}

// Count TotalPrice
function countTotalPriceAndDelivery() {
  const cartItems = cartWrapper.querySelectorAll(".cart-item");
  const totalPriceElem = document.querySelector(".total-price");
  const delivery = document.querySelector(".delivery-cost");
  console.log(delivery);
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const amountElem = item.querySelector("[data-counter]").innerHTML;
    const priceElem = item.querySelector(".price__currency").innerHTML;
    const currentPrice =
      parseInt(amountElem) * parseInt(priceElem);
    totalPrice += currentPrice;
  });
  if (totalPrice < 600) {
    delivery.innerHTML = "250 p";
    delivery.classList.remove("free");
  } else if (totalPrice >= 600) {
    delivery.innerHTML = "бесплатно";
    delivery.classList.add("free");
  }

  totalPriceElem.innerHTML = totalPrice;
}
