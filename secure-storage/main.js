const secureStorage = require("uxp").storage.secureStorage;

async function saveSecureKey() {
  const userInput = document.getElementById("securekey").value;
  await secureStorage.setItem("secure", userInput);
  document.getElementById("securekey").value = "";
}

async function fetchSecureKey() {
  // We get the stored value from the secureStorage in the form of a uint8Array.
  const uintArray = await secureStorage.getItem("secure");
  // We convert the uint8Array to a string to present it to the user.
  let secureKey = Array.from(uintArray, i => String.fromCharCode(i)).join("");
  document.getElementById("display").textContent = `
  Secure Key entered is ${secureKey}`;
}

document.getElementById("save").addEventListener("click", saveSecureKey);
document.getElementById("fetch").addEventListener("click", fetchSecureKey);
