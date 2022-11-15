import { menuArray } from "./data.js"

const orderModal = document.getElementById("modal")
const adModal = document.getElementById("ad-modal")
const creditCardDetails = document.getElementById("credit-card-details")
const order = document.getElementById("order")
const message = document.getElementById("message")

let firstName = ""

let orderObj = {
    pizza: 0,
    hamburger: 0,
    beer: 0,
    mealDeal: 0
}
let isPaid = false;

setTimeout(()=>{
    adModal.style.display = "inline"
}, 1500)

document.addEventListener("click", e =>{
    if(e.target.dataset.add){
        handleAddClick(e.target.dataset.add)
    } else if(e.target.dataset.remove) {
        handleRemoveClick(e.target.dataset.remove)
    } else if(e.target.id === "order-btn") {
        handleOrderClick()
    } else if(e.target){
        console.log(`e.target`,e.target)
    }
    render()
})

creditCardDetails.addEventListener("submit", e=>{
    e.preventDefault()
    const creditCardDetailsData = new FormData(creditCardDetails)
    // console.log(`creditCardDetails`,creditCardDetailsData)
    const creditCardName = creditCardDetailsData.get("creditCardName")
    // console.log("creditCardName",creditCardName)
    const creditCardNumber = creditCardDetailsData.get("creditCardNumber")
    // console.log("creditCardNumber",creditCardNumber)
    const creditCardCvv = creditCardDetailsData.get("creditCardCvv")
    // console.log("creditCardCvv", creditCardCvv)
    firstName = creditCardName.split(" ")[0]
    isPaid = true;
    closeOrderModal()
    render()
})

window.addEventListener("mouseup", e => {
    if(!orderModal.contains(e.target)) {
        closeOrderModal()
    }
})

window.addEventListener("mouseup", e => {
    if(!adModal.contains(e.target)) {
        closeAdModal()
    }
})

function closeOrderModal(){
    orderModal.style.display = "none"
}

function closeAdModal(){
    adModal.style.display = "none"
}

function handleAddClick(itemId){
    
    // console.log(itemId)
    if(itemId == 0) {
        orderObj.pizza = orderObj.pizza + 1
    } else if(itemId == 1) {
        orderObj.hamburger = orderObj.hamburger + 1
    } else if(itemId == 2) {
        orderObj.beer = orderObj.beer + 1
    } else if(itemId == 3) {
        orderObj.mealDeal = orderObj.mealDeal + 1
        closeAdModal()
    }
    // console.log(`orderObj`,orderObj) 
    order.scrollIntoView()
}

function handleRemoveClick(removeItem) {
    if(removeItem === "pizza") {
        orderObj.pizza = orderObj.pizza - 1
    } else if(removeItem === "hamburger") {
        orderObj.hamburger = orderObj.hamburger - 1
    } else if(removeItem === "beer") {
        orderObj.beer = orderObj.beer - 1
    } else if(removeItem === "mealDeal") {
        orderObj.mealDeal = orderObj.mealDeal - 1
    }
    // console.log("removed orderObj", orderObj)
    render()
}

function handleOrderClick() {
    orderModal.style.display = "inline"
}

function getMenuHtml(){
    let menuHtml = ``
    menuArray.forEach((item, index) => {
        const ingredientsString = item.ingredients.join(", ")
        menuHtml += `
        <div class="menu--item">
            <!-- insert menu item image here -->
            <p class="item-img">${item.emoji}</p>
            <div class="menu--item-details">
                <p class="menu--item-name">${item.name}</p>
                <p class="menu--item-ingredients">${ingredientsString}</p>
                <p class="menu--item-price">$${item.price}</p>
            </div> <!-- menu--item-details -->
            <i class="fa-solid fa-circle-plus fa-3x menu--add-btn" data-add="${item.id}" ></i>
        </div> <!-- menu--item -->
        `
    })
    return menuHtml
}

function calculateOrder(){
    let totalBill = 0
    Object.keys(orderObj).forEach((item, index) => {
        console.log(`item`, item, index)
        const itemName = menuArray[index].name
        console.log(`itemName`,itemName)
        // const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1)
        const itemElem = menuArray.filter(item => item.name === itemName)
        // console.log(`itemPrice`, itemElem[0].price)
        const itemPrice = itemElem[0].price
        // console.log(`orderObj[item]`,orderObj[item])
        const totalPrice = itemPrice * orderObj[item]
        totalBill += totalPrice
        if(orderObj[item] > 1) {
            document.getElementById(`order--${item}`).innerHTML = `
                ${itemName} x${orderObj[item]}
                <button class="remove-btn" data-remove="${item}">remove</button>
                <span class="order--item-total" id="${item}-total"></span>
                `
            document.getElementById(`${item}-total`).innerHTML = `$${totalPrice}`
        } else if(orderObj[item] == 1) {
            document.getElementById(`order--${item}`).innerHTML = `
                ${itemName}
                <button class="remove-btn" data-remove="${item}">remove</button>
                <span class="order--item-total" id="${item}-total"></span>
                `
            // console.log(document.getElementById(`${item}-total`))
            document.getElementById(`${item}-total`).innerHTML = `$${totalPrice}`
        }
        if(orderObj[item] > 0) {
            document.getElementById("total-price").innerHTML = `
            Total Price:
            <span class="total-bill">$${totalBill}</span>
            `
            document.getElementById("complete-order").innerHTML = `
            <button class="order-btn" id="order-btn">Complete order</button>
            `
        }
    })
}

function getOrderHtml(){
    let orderHtml = `
        <p class="order--title">Your Order</p>
        <div class="order--items">
            <p class="order-item" id="order--pizza"></p>
            <p class="order-item" id="order--hamburger"></p>
            <p class="order-item" id="order--beer"></p>
            <p class="order-item" id="order--mealDeal"></p>
        </div>
        <p class="total-price" id="total-price"></p>
        <span id="complete-order"></span>
        `
    return orderHtml
}

function render(){
    message.style.display = "none"
    document.getElementById("menu").innerHTML = getMenuHtml()
    if(isPaid) {
        order.style.display = "none"
        message.style.display = "flex"
        message.innerHTML = `
            <p class="message--text">Thanks, ${firstName}! Your order is on its way!</p>
            `
    } else if(orderObj.pizza > 0 || orderObj.hamburger > 0 || orderObj.beer > 0 || orderObj.mealDeal > 0){
        order.innerHTML = getOrderHtml()
    } else {
        order.innerHTML = ``
    }
    calculateOrder()
}

render()

// else if(orderObj.pizza > 0 || orderObj.hamburger > 0 || orderObj.beer > 0 || orderObj.mealDeal > 0){
//         order.innerHTML = getOrderHtml()
//     } else {
//         order.innerHTML = ``
//     }
//     calculateOrder()