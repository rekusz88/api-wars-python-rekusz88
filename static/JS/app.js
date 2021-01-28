function init(openUrl = 'https://swapi.dev/api/planets/?page=1') {
    // let openUrl = 'https://swapi.dev/api/planets/?page=1';
    loadData(openUrl).then(function nextSteps(object) {
        printDataHTML(object);
    }).catch(err => console.log(err));
}

function loadData(urlLink = 'https://swapi.dev/api/planets/?page=1') {
    return fetch(urlLink).then(function (response) {
        return response.json()
    })
        .then(function (object) {
            return object; // that is the full data-pack from remote URL
        })
        .catch(function (error) {
            console.log('something went wrong');
            console.log(error);
        });
}

function printDataHTML(allData) {
    let cleanedInputData = allData.results;
    let targetTable = document.getElementById("table_body");
    for (let i = 0; i <= cleanedInputData.length - 1; i++) {
        let tableRow = targetTable.insertRow();
        tableRow.setAttribute('id', i.toString());
        let input_1 = tableRow.insertCell(0);
        let input_2 = tableRow.insertCell(1);
        let input_3 = tableRow.insertCell(2);
        let input_4 = tableRow.insertCell(3);
        let input_5 = tableRow.insertCell(4);
        let input_6 = tableRow.insertCell(5);
        let input_7 = tableRow.insertCell(6);
        input_1.innerHTML = cleanedInputData[i].name;
        input_2.innerHTML = cleanedInputData[i].diameter;
        input_3.innerHTML = cleanedInputData[i].climate;
        input_4.innerHTML = cleanedInputData[i].terrain;
        input_5.innerHTML = cleanedInputData[i].surface_water;
        input_6.innerHTML = cleanedInputData[i].population;
        let counter = countResident(cleanedInputData[i].residents)
        if (counter > 0) {
            input_7.innerHTML = counter + " resident" + "(s)";
            input_7.classList.add('resident-button');
            input_7.classList.add('btn');
            input_7.classList.add('btn-primary');
            input_7.setAttribute('planet', cleanedInputData[i].url);
            input_7.setAttribute('planet-name', cleanedInputData[i].name);
            input_7.outerHTML = input_7.outerHTML.replace(/^<td/, '<button')
        } else {
            input_7.innerHTML = "No known residents";
        }
        input_2.innerHTML = parseInt(input_2.innerHTML).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' km';
        if (input_5.innerHTML != 'unknown') {
            input_5.innerHTML = parseInt(input_5.innerHTML) + '%';
        }
        if (input_6.innerHTML != 'unknown') {
            input_6.innerHTML = parseInt(input_6.innerHTML).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' people';
        }
    }
    getResidentData();
}

function countResident(residentsList) {
    let counter = 0;
    for (let resident of residentsList) {
        counter++
    }
    return counter
}

function next_page_single() {
    let url = 'https://swapi.dev/api/planets/?page=';
    let pageNumber = document.getElementById('pageIndex').dataset.pageNumber;
    pageNumber = parseInt(pageNumber) + 1;
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    document.getElementById('pageIndex').dataset.pageNumber = pageNumber.toString();
    if (pageNumber < 7) {
    	prev.disabled = false;
        let link = url + pageNumber.toString();
        loadData(link).then(function nextSteps(object) {
            deleteRow();
            printDataHTML(object);
        }).catch(err => console.log(err));
    } else {
        next.disabled = true;
    }
}


function previous_page_single() {
    let url = 'https://swapi.dev/api/planets/?page=';
    let pageNumber = document.getElementById('pageIndex').dataset.pageNumber;
    pageNumber = parseInt(pageNumber) - 1;
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');
    document.getElementById('pageIndex').dataset.pageNumber = pageNumber.toString();
    if (pageNumber > 0) {
    	next.disabled = false;
        let link = url + pageNumber.toString();
        loadData(link).then(function nextSteps(object) {
            deleteRow();
            printDataHTML(object);
        }).catch(err => console.log(err));
    } else {
        prev.disabled = true;
    }
}


function deleteRow() {
    let toBECleanDOM = document.getElementById("table_body");
    while (toBECleanDOM.firstChild) {
        toBECleanDOM.removeChild(toBECleanDOM.firstChild)
    }
}

function getResidentData() {
    const residentButtons = document.querySelectorAll('.resident-button');
    residentButtons.forEach(residentButton => {
        residentButton.addEventListener('click', displayData);
    })
}

function setBackgroundOpacity(opacityValue) {
    const body = document.querySelector('body');
    body.insertAdjacentHTML("beforeend", `<div class="modal-backdrop"></div>`);
    const background = document.querySelector('.modal-backdrop');
    background.style.opacity = opacityValue;
}

async function displayData(e) {
    let residentModal = document.querySelector('.modal');
    residentModal.style.display = 'block';
    setBackgroundOpacity(0.7);
    let planetUrl = e.currentTarget.getAttribute('planet');
    let planetName = "Residents of " + e.currentTarget.getAttribute('planet-name');
    let modalTitle = document.querySelector('.modal-title');
    let residents = await getPlanetData(planetUrl);
    let peopleData = await getPeopleData(residents);
    modalTitle.innerHTML = planetName;
    for (let residentData of peopleData) {
        let rowData = `<tr>
                        <td>${residentData.name}</td>
                        <td>${residentData.height}</td>
                        <td>${residentData.mass}</td>
                        <td>${residentData.hair_color}</td>
                        <td>${residentData.skin_color}</td>
                        <td>${residentData.eye_color}</td>
                        <td>${residentData.birth_year}</td>
                        <td>${residentData.gender}</td>
                    </tr>`;
        let residentRow = document.querySelector('.modal-body').firstElementChild;
        residentRow.insertAdjacentHTML("beforeend", rowData);
    }
    const closeX = document.querySelector(".close");
    const closeButton = document.querySelector(".btn-secondary");
    closeX.addEventListener('click', closeModal);
    closeButton.addEventListener('click', closeModal);
}

function closeModal() {
    let residentModal = document.querySelector('.modal');
    residentModal.style.display = 'none';
    document.body.querySelector('.modal-backdrop').remove();
    let tableElements = document.querySelectorAll(".modal-body table tbody");
    for (const tableElement of tableElements) {
        tableElement.remove();
    }
}

async function getPeopleData(residentUrls) {
    let people = [];
    for (let residentUrl of residentUrls) {
        const response = await fetch(`${residentUrl}`);
        const data = await response.json();
        people.push(data);
    }
    return people
}

async function getPlanetData(planetUrl) {
    const response = await fetch(`${planetUrl}`);
    const data = await response.json();
    return data.residents
}

init();


