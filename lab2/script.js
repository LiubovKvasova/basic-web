'use strict';

const body = document.querySelector("body");
const div_with_answers = document.getElementById("answers");
let is_valid = true;
let error_fields = [];
let answer_fields = [];

function clear() {
  error_fields.forEach(error_field => {
    const field = document.getElementById(error_field);
    field.style.background = "white";
    field.style.border = "2px #858585 solid";
  });
  while (div_with_answers.firstChild) {
    div_with_answers.removeChild(div_with_answers.firstChild);
  }
  is_valid = true;
  error_fields = [];
  answer_fields = [];
}

function check(id, regex, name) {
  const valueFromElement = document.getElementById(id).value;
  if (valueFromElement.match(regex)) {
    const answer = document.createElement("p");
    answer.innerHTML = "<b>" + name + "</b>: " + valueFromElement;
    answer_fields.push(answer);
  } else {
    is_valid = false;
    error_fields.push(id);
  }
}

function confirm() {
  clear();
  check("name", /^[A-ZА-ЯІЇЄ][a-zA-ZА-ЯІЇЄа-яіїє]+ [A-ZА-ЯІЇЄ]\.[A-ZА-ЯІЇЄ]\.$/, "ПІБ");
  check("group", /^[A-ZА-ЯІЇЄ][a-zA-ZА-ЯІЇЄа-яіїє]+-\d{2}$/, "Група");
  check("id_card", /^[A-ZА-ЯІЇЄ]{2} №\d{6}$/, "ID-card");
  check("birthday", /^\d{2}.\d{2}.\d{4}$/, "День народження");
  check("email", /^\w+@\w+\.com$/, "E-mail");

  if (is_valid) {
    const entered_data = document.createElement("h3");
    entered_data.innerHTML = "Введені дані";
    div_with_answers.appendChild(entered_data);
    answer_fields.forEach(answer => div_with_answers.appendChild(answer));
  } else {
    error_fields.forEach(error_field => {
      const field = document.getElementById(error_field);
      field.style.background = "#ffeeee";
      field.style.border = "2px #ff7a7a solid";
    });
  }
}

function createTable() {
  const body = document.querySelector('body');
  const table = document.querySelector('.table');
  for (let i = 0; i < 6; i++) {
    const rowElement = document.createElement('tr');
    for (let j = 0; j < 6; j++) {
      const cellElement = document.createElement('td');
      const cellValue = j + 1 + i * 6;
      cellElement.innerHTML = cellValue;
      cellElement.id = cellValue;
      rowElement.appendChild(cellElement);
    }
    table.appendChild(rowElement);
  }
}
createTable();

const myvariant = 8;
const myelement = document.getElementById(myvariant);

function changeColorRandom(myelement) {
  myelement.style.background = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
}

function click(myelement) {
  const color = document.getElementById('colors');
  myelement.style.backgroundColor = color.value;
}

function doubleclick() {
  const startColumn = myvariant % 6;
  for (let j = startColumn - 1; j < 6; j+=2) {
    for (let i = 0; i < 6; i++) {
      const currentElement = document.getElementById(j + 1 + i * 6);
      currentElement.style.background = document.getElementById('colors').value;
    }
  }
}
myelement.onmouseover = () => {
  changeColorRandom(myelement);
}
myelement.onmouseup = () => {
  click(myelement);
}
myelement.ondblclick = () => {
  doubleclick();
}