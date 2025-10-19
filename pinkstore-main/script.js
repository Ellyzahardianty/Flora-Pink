// Product data
const products = {
  1: { name: "Monstera Deliciosa", price: 150000, image: "/monstera-deliciosa-plant.jpg", category: "indoor" },
  2: { name: "Sansevieria", price: 75000, image: "/snake-plant-sansevieria.png", category: "indoor" },
  3: { name: "Bougenville", price: 120000, image: "/bougainvillea-flowering-plant.jpg", category: "outdoor" },
  4: { name: "Kembang Sepatu", price: 85000, image: "/hibiscus-flowering-plant.jpg", category: "outdoor" },
  5: { name: "Echeveria", price: 45000, image: "/echeveria-succulent-plant.jpg", category: "succulent" },
  6: { name: "Jade Plant", price: 60000, image: "/jade-plant-succulent.jpg", category: "succulent" },
}

// Cart data
let cart = {}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  // Set up event listeners
  document.getElementById("start-btn").addEventListener("click", () => {
    showPage("product")
  })

  document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Segera Hadir! Fitur checkout akan tersedia dalam waktu dekat.")
  })

  // Load cart from localStorage if available
  loadCart()
  updateCartDisplay()
})

// Page navigation
function showPage(pageId) {
  // Hide all pages
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))

  // Show selected page
  const targetPage = document.getElementById(pageId + "-page")
  if (targetPage) {
    targetPage.classList.add("active")
  }

  // Update cart display when showing cart page
  if (pageId === "cart") {
    displayCartItems()
  }
}

// Add item to cart
function addToCart(productId) {
  const product = products[productId]
  if (!product) return

  // Add to cart or increase quantity
  if (cart[productId]) {
    cart[productId].quantity += 1
  } else {
    cart[productId] = {
      ...product,
      quantity: 1,
    }
  }

  // Disable the button
  const button = event.target
  button.disabled = true
  button.textContent = "Ditambahkan"

  // Update cart display
  updateCartDisplay()
  saveCart()

  // Show success feedback
  showNotification(`${product.name} ditambahkan ke keranjang!`)
}

// Update cart display (cart count)
function updateCartDisplay() {
  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0)

  // Update cart count in header
  const cartCountElements = document.querySelectorAll("#cart-count, #cart-count-header")
  cartCountElements.forEach((element) => {
    element.textContent = totalItems
  })
}

// Display cart items on cart page
function displayCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  const totalItemsElement = document.getElementById("total-items")
  const totalPriceElement = document.getElementById("total-price")

  // Clear existing items
  cartItemsContainer.innerHTML = ""

  const cartItems = Object.entries(cart)

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Keranjang Kosong</h2>
                <p>Belum ada item dalam keranjang belanja Anda.</p>
            </div>
        `
    totalItemsElement.textContent = "0"
    totalPriceElement.textContent = "Rp 0"
    return
  }

  let totalItems = 0
  let totalPrice = 0

  cartItems.forEach(([productId, item]) => {
    totalItems += item.quantity
    totalPrice += item.price * item.quantity

    const cartItemElement = document.createElement("div")
    cartItemElement.className = "cart-item"
    cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-price">Rp ${item.price.toLocaleString("id-ID")}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${productId})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity(${productId})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${productId})">Hapus</button>
            </div>
        `
    cartItemsContainer.appendChild(cartItemElement)
  })

  // Update totals
  totalItemsElement.textContent = totalItems
  totalPriceElement.textContent = `Rp ${totalPrice.toLocaleString("id-ID")}`
}

// Increase quantity
function increaseQuantity(productId) {
  if (cart[productId]) {
    cart[productId].quantity += 1
    updateCartDisplay()
    displayCartItems()
    saveCart()
  }
}

// Decrease quantity
function decreaseQuantity(productId) {
  if (cart[productId] && cart[productId].quantity > 1) {
    cart[productId].quantity -= 1
    updateCartDisplay()
    displayCartItems()
    saveCart()
  }
}

// Remove item from cart
function removeFromCart(productId) {
  if (cart[productId]) {
    delete cart[productId]

    // Re-enable the add to cart button
    const buttons = document.querySelectorAll(".add-to-cart-btn")
    buttons.forEach((button) => {
      if (button.getAttribute("onclick") === `addToCart(${productId})`) {
        button.disabled = false
        button.textContent = "Tambahkan ke Keranjang"
      }
    })

    updateCartDisplay()
    displayCartItems()
    saveCart()
    showNotification("Item berhasil dihapus dari keranjang!")
  }
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("florapink_cart", JSON.stringify(cart))
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("florapink_cart")
  if (savedCart) {
    cart = JSON.parse(savedCart)

    // Update button states
    Object.keys(cart).forEach((productId) => {
      const buttons = document.querySelectorAll(".add-to-cart-btn")
      buttons.forEach((button) => {
        if (button.getAttribute("onclick") === `addToCart(${productId})`) {
          button.disabled = true
          button.textContent = "Ditambahkan"
        }
      })
    })
  }
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #e91e63, #f06292);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(233, 30, 99, 0.4);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `
  notification.textContent = message

  // Add animation keyframes
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}
