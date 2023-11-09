document.addEventListener("DOMContentLoaded", function () {
  const resultDiv = document.getElementById("result");
  const cbmTotalText = document.getElementById("cbm-total");
  const costTotalText = document.getElementById("cost-total");
  const priceInput = document.getElementById("price");
  const productEntries = document.getElementById("product-entries");
  const addProductButton = document.getElementById("add-product");

  addProductButton.addEventListener("click", () => {
    createProductEntry();
  });

  priceInput.addEventListener("input", () => {
    calculateCost();
  });

  document.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      createProductEntry();
    }
  });

  function createProductEntry() {
    const productEntry = document.createElement("div");
    productEntry.className = "product-entry";

    const productNumber = productEntries.querySelectorAll(".product-entry").length + 1;

    productEntry.innerHTML = `
      <h3>Product ${productNumber}</h3>
      <button type="button" class="remove-product">Remove Product</button>
      <label for="dimension">Dimension (LxWxH):</label>
      <input type="number" class="dimension-input" step="0.01" required onclick="this.select()">
      <input type="number" class="dimension-input" step="0.01" required onclick="this.select()">
      <input type="number" class="dimension-input" step="0.01" required onclick="this.select()">
      <select class="dimension-unit">
        <option value="mm">mm</option>
        <option value="cm">cm</option>
        <option value="m">m</option>
      </select>
      <br>

      <label for="quantity">Quantity:</label>
      <input type="number" class="quantity-input" value="1" required onclick="this.select()">
      <br>

      <p>Total CBM: <span class="cbm-product">0.00</span><span class="BHD"> m³</span></p>
      <p>Total Cost: <span class="cost-product">0.00</span><span class="BHD"> BHD</span></p>
    `;

    productEntries.appendChild(productEntry);

    // Get the unit from the previous product (if available)
    const previousProductEntry = productEntry.previousElementSibling;
    if (previousProductEntry) {
      const previousUnit = previousProductEntry.querySelector(".dimension-unit").value;
      productEntry.querySelector(".dimension-unit").value = previousUnit;
    }

    productEntry.querySelector(".remove-product").addEventListener("click", () => {
      productEntries.removeChild(productEntry);
      renumberProducts();
      calculateCost();
    });
  }

  productEntries.addEventListener("input", () => {
    calculateCost();
  });

  function renumberProducts() {
    const productList = productEntries.querySelectorAll(".product-entry");
    productList.forEach((product, index) => {
      const productNumber = index + 1;
      product.querySelector("h3").textContent = `Product ${productNumber}`;
    });
  }

  function calculateCost() {
    const productList = productEntries.querySelectorAll(".product-entry");
    let totalCBM = 0;
    let totalCost = 0;
    const price = parseFloat(priceInput.value);

    productList.forEach((productEntry) => {
      const dimensionInputs = productEntry.querySelectorAll(".dimension-input");
      const dimensionUnitSelect = productEntry.querySelector(".dimension-unit");
      const quantityInput = productEntry.querySelector(".quantity-input");
      const cbmProduct = productEntry.querySelector(".cbm-product");
      const costProduct = productEntry.querySelector(".cost-product");

      const length = parseFloat(dimensionInputs[0].value);
      const width = parseFloat(dimensionInputs[1].value);
      const height = parseFloat(dimensionInputs[2].value);
      const quantity = parseInt(quantityInput.value);

      const dimensionUnit = dimensionUnitSelect.value;
      const lengthInMeters = convertToMeters(length, dimensionUnit);
      const widthInMeters = convertToMeters(width, dimensionUnit);
      const heightInMeters = convertToMeters(height, dimensionUnit);
      const volume = lengthInMeters * widthInMeters * heightInMeters;
      const cbm = volume * quantity;
      const cost = price * volume * quantity;

      cbmProduct.textContent = `${cbm.toFixed(2)}`;
      costProduct.textContent = `${cost.toFixed(3)}`;

      totalCBM += cbm;
      totalCost += cost;
    });

    cbmTotalText.innerHTML = `${totalCBM.toFixed(2)} <span class='BHD'>m³</span>`;
    costTotalText.innerHTML = `${totalCost.toFixed(3)} <span class='BHD'>BHD</span>`;

    resultDiv.style.display = "block";
  }

  function convertToMeters(value, unit) {
    switch (unit) {
      case "mm":
        return value / 1000;
      case "cm":
        return value / 100;
      case "m":
        return value;
      default:
        return value;
    }
  }
});
