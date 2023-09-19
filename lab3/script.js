'use strict';

const button = document.getElementById("get-data");
const userContainer = document.querySelector(".users");

button.addEventListener("click", async () => {
  while (userContainer.lastElementChild) {
    userContainer.lastElementChild.remove();
  }

  const response = await fetch("https://randomuser.me/api?inc=picture,name,location,phone&results=8");
  const data = await response.json();
  const results = data.results;
  
  if (results) {
    for (const result of results) {
      const user = document.createElement("div");
      user.className = "user";

      const {picture, name, location, phone} = result;
      const {country, postcode} = location;
      console.log(picture.large, `${name.first} ${name.last}`, country, postcode, phone);

      const pictureEl = document.createElement("img");
      pictureEl.src = picture.large;
      user.appendChild(pictureEl);

      const nameEl = document.createElement("p");
      nameEl.innerText = `Name: ${name.first} ${name.last}`;
      user.appendChild(nameEl);

      const countryEl = document.createElement("p");
      countryEl.innerText = "Country: " + country;
      user.appendChild(countryEl);

      const postcodeEl = document.createElement("p");
      postcodeEl.innerText = "Postcode: " + postcode;
      user.appendChild(postcodeEl);

      const phoneEl = document.createElement("p");
      phoneEl.innerText = "Phone: " + phone;
      user.appendChild(phoneEl);

      userContainer.appendChild(user);
    }
  }
});