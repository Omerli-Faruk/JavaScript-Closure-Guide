// ==========================================
// 1. CLOSURE STRUCTURE (MAIN SYSTEM)
// ==========================================
function createSecureCart(apiBaseUrl) {

    // POINT 1 & 4: Our private data, inaccessible from the outside.
    let cartTotal = 0;

    return {
        // POINT 2: Our factory function that generates tasks
        generateButtonTask: function (productName, price) {

            return function () {
                cartTotal += price; // Add price to the total

                // Update the UI (For visual feedback)
                document.getElementById('bakiye-gosterge').innerText = cartTotal;
                document.getElementById('bilgi-mesaji').innerText = `[API] Request sent to ${apiBaseUrl}. ${productName} added to cart!`;
                document.getElementById('bilgi-mesaji').style.color = "green";
            }
        },

        // A secure method to read the balance without modifying it
        showBalance: function () {
            return cartTotal;
        }
    }
}

// ==========================================
// 2. INITIALIZING THE SYSTEM
// ==========================================
// We create the cart object and MEMORIZE the API address (Point 3)
let myCart = createSecureCart("https://api.mysite.com/add-to-cart");

/*
If we didn't use closures, we would have to do this for EVERY button:
    const APPLE = document.getElementById('elma-btn')
    APPLE.addEventListener('click', () => {
        createSecureCart("https://api.mysite.com/add-to-cart", "Apple", 20)
    })
POINT 2 prevents us from creating redundant event listeners manually,
and POINT 3 prevents us from rewriting "https://api.mysite.com/add-to-cart" every single time.
*/

// Assigning tasks to the static buttons that already exist in HTML
document.getElementById('elma-btn').onclick = myCart.generateButtonTask("Apple", 20);
document.getElementById('laptop-btn').onclick = myCart.generateButtonTask("Laptop", 25000);

// ==========================================
// 3. DYNAMICALLY CREATING CUSTOM BUTTONS (FACTORY TEST)
// ==========================================
document.getElementById('kendi-butonumu-ekle-btn').onclick = function () {
    // Stop the process if the system is shut down
    if (!myCart) {
        alert("System is offline! You cannot add products.");
        return;
    }

    // Get values from the inputs
    let productName = document.getElementById('yeni-urun-adi').value;
    let productPrice = Number(document.getElementById('yeni-urun-fiyat').value);

    // Warn if inputs are empty or invalid
    if (!productName || productPrice <= 0) {
        alert("Please enter a valid product name and price.");
        return;
    }

    // A) Create the new Button as an HTML element
    let newButton = document.createElement("button");
    newButton.className = "urun-btn"; // Inherit the same CSS styling
    newButton.innerText = `🛒 Add ${productName} (${productPrice} TL)`;
    newButton.style.backgroundColor = "#ff9800"; // Colored orange to distinguish dynamic buttons

    // B) Run the Closure factory and bind the task to the new button!
    newButton.onclick = myCart.generateButtonTask(productName, productPrice);

    // C) Append the button to the screen
    document.getElementById('urunler-kutusu').appendChild(newButton);

    // D) Clear the input fields
    document.getElementById('yeni-urun-adi').value = "";
    document.getElementById('yeni-urun-fiyat').value = "";

    // Inform the user on the screen
    document.getElementById('bilgi-mesaji').innerText = `✨ '${productName}' button was dynamically created!`;
    document.getElementById('bilgi-mesaji').style.color = "blue";
};


// ==========================================
// 4. TEST SCENARIOS (Hacker and System Shutdown)
// ==========================================

// --- HACKER ATTEMPT BUTTON ---
document.getElementById('hacker-btn').onclick = function () {
    if (!myCart) return;

    // Hacker tries to manipulate and reset the total directly!
    myCart.hiddenTotalAmount = 0; // Attempting to bypass

    // Let's read the actual balance to see if it was reset
    let actualBalance = myCart.showBalance();

    document.getElementById('bilgi-mesaji').innerText = `🚨 Hacker tried to reset the total, but failed! Actual Balance is still: ${actualBalance} TL`;
    document.getElementById('bilgi-mesaji').style.color = "red";
};

// --- SHUTDOWN / GARBAGE COLLECTOR TEST ---
document.getElementById('cikis-btn').onclick = function () {

    // 1- CLEAR MEMORY (JavaScript side - Triggers Garbage Collector)
    myCart = null;

    // 2- DELETE ALL BUTTONS FROM THE SCREEN (HTML Side)
    // Deletes everything inside the products container (including dynamic ones).
    document.getElementById('urunler-kutusu').innerHTML = "";

    // Hide the new product creation panel as well
    document.getElementById('yeni-urun-alani').style.display = "none";

    // 3- Print info to the screen
    document.getElementById('bakiye-gosterge').innerText = "---";
    document.getElementById('bilgi-mesaji').innerText = "🗑️ Cart deleted from memory, buttons removed from the screen!";
    document.getElementById('bilgi-mesaji').style.color = "black";
};