document.addEventListener("DOMContentLoaded", function () {
  const inputFields = document.querySelectorAll(".dimension-input");
  const dimensionUnitSelect = document.getElementById("dimension-unit");
  const priceInput = document.getElementById("price"); // Add this line
  const resultDiv = document.getElementById("result");
  const costText = document.getElementById("cost");

  // Load the selected dimension unit and price from cookies (if available)
  const selectedUnit = getCookie("selectedUnit");
  const savedPrice = getCookie("price"); // Add this line
  if (selectedUnit) {
    dimensionUnitSelect.value = selectedUnit;
  }
  if (savedPrice) {
    priceInput.value = savedPrice; // Add this line
  }

  // Add an event listener to save the selected unit to cookies
  dimensionUnitSelect.addEventListener("change", () => {
    const selectedUnit = dimensionUnitSelect.value;
    setCookie("selectedUnit", selectedUnit, 30); // Store for 30 days
    calculateCost();
  });

  // Add an event listener to save the price to cookies
  priceInput.addEventListener("input", () => {
    const price = priceInput.value;
    setCookie("price", price, 30); // Store for 30 days
    calculateCost();
  });

  inputFields.forEach((input) => {
    input.addEventListener("input", () => {
      calculateCost();
    });
  });

  function calculateCost() {
    const price = parseFloat(priceInput.value); // Update to use the priceInput
    const length = parseFloat(document.getElementById("length").value);
    const width = parseFloat(document.getElementById("width").value);
    const height = parseFloat(document.getElementById("height").value);

    const dimensionUnit = dimensionUnitSelect.value;

    // Convert all dimensions to meters
    const lengthInMeters = convertToMeters(length, dimensionUnit);
    const widthInMeters = convertToMeters(width, dimensionUnit);
    const heightInMeters = convertToMeters(height, dimensionUnit);

    // Calculate the volume in cubic meters
    const volume = lengthInMeters * widthInMeters * heightInMeters;

    // Calculate the cost
    const cost = price * volume;

    costText.innerHTML = `${cost.toFixed(3)}<span class="dollar-sign"> BHD</span>`; // Wrap the cost in a span
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

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()}`;
  }

  // Function to get a cookie by name
  function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(`${name}=`)) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  }
});
