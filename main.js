const searchField = document.querySelector(".search-field");
const countriesCount = document.getElementById("countries-count");
const message = document.querySelector(".message");
const nameNavBtn = document.getElementById("name");
const capitalNavBtn = document.getElementById("capital");
const populationNavBtn = document.getElementById("populations");
const chartNavBtn = document.querySelector(".chart-btn");
const container = document.querySelector(".countries-data");
const nameArrow = document.querySelector("#name .arrow");
const capitalArrow = document.querySelector("#capital .arrow");
const populationArrow = document.querySelector("#populations .arrow");
const chartSection = document.getElementById("chart");
const chartText = document.querySelector(".chart-paragraph");
const chartPopulationNavBtn = document.querySelector(".population")
const chartLanguageNavBtn = document.querySelector(".language");

class Format{
    static spaceToEachLanguage(arr) {
        let res = "";

        // add a comma to the language except it is the last element in the array
        for (let i = 0; i < arr.length; i++) {
            if (i === arr.length - 1) {
                res += arr[i];
                break
            }

            res += (arr[i] + ", ")
        }

        return res
    }
    
    static changingArrowDir(elem, dir){
        elem.style.transform = `rotate(${dir}deg)`;
    }
            
    // calculating width for the country-data-bar
    static calculateWidth(num, total){
        let result = `${(Math.floor((num / total) * 100))}%`

        // checks if the result is less than 1% and if yes, sets it to one
        result <= "1%" ? result = "1%" : "";
        return result;
    }
}

class UI {
    static addCountryDivToPage(flag, name, capital, lang, population){
        let form = `
            <div class="country-self">
                <div class="country-flag"><img src="${flag}"></div>
                <div class="country-details">
                    <h3 class="country-name"> ${name}</h3>
                    <p>Capital: ${capital}</p>
                    <p>Languages: ${Format.spaceToEachLanguage(lang)}</p>
                    <p>Population: ${population}</p>
                </div>
            </div>
        `

        return form
    }

    static showCountriesData = (func, elem) => {
        // send an ajax request and store it to local storage
        Chart.storeLocalStorage();
        const countriesData = JSON.parse(localStorage.getItem("countriesData"));

        let res = func(countriesData, elem);

        container.innerHTML = res;
        countriesCount.innerHTML = countriesData.length;
    }

    static insertCountries(arr){
        let output = ""

        arr.forEach((country) => {                         
            output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
        })
        return output;
    }

    static findCountryName(arr, elem){
        let output = ""

        arr.forEach((country) => {
            if(country.name.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        })
        return output;
    }

    // display the countries in descending order
    static findReversedCountryName(arr, elem){
        let output = ""

        arr.reverse();

        arr.forEach((country) => {
            if(country.name.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        })
        return output;
    }

    // display the countries capital when searching
    static findCapital(arr, elem) {
        let output = ""

        arr.sort((a, b)=> {
            if(a.capital < b.capital){
                return -1
            } else if(a.capital > b.capital){
                return 1
            } else{
                return 0
            }
        });

        // i am using the for..of loop and not forEach because i want to utilize the continue keyword
        // continue only works with loops
        for( let country of arr) {
            if(country.capital === undefined){
                continue;
            } else if(country.capital.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        }
        return output;
    }

    // display the countries capital in descending order
    static findReversedCapital(arr, elem){
        let output = ""

        // reverse the api data based on the alphabetical arrangement of the capital
        arr.sort((a, b)=> {
            if(a.capital > b.capital){
                return -1
            } else if(b.capital > a.capital ){
                return 1
            } else{
                return 0
            }
        });

        for( let country of arr) {
            if(country.capital === undefined){
                continue;
            } else if(country.capital.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        }

        return output;
    }

    static descendingPopulation(arr, elem){
        let output = ""        
        
        arr.sort((a, b) => b.population - a.population);

        for( let country of arr) {
            if(country.name.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        }

        return output;
    }
    
    static ascendingPopulation(arr, elem){
        let output = ""        
        
        arr.sort((a, b) => a.population - b.population);

        for( let country of arr) {
            if(country.name.toLowerCase().startsWith(elem)){                            
                output += UI.addCountryDivToPage(country.flag, country.name, country.capital, country.languages, country.population);
            }
        }

        return output;
    }

    // displaying countries based on the user's input
    static searching(elem,func){
        searchField.addEventListener("input", () => {
            UI.showCountriesData(elem, searchField.value);  
            func(searchField.value);
            let country = document.querySelectorAll(".country-self");
            message.innerHTML = `${country.length} satisfied the search condition`;
        })
    }
    
    // showing back to top arrow
    static scrollDown(){
        // back to top btn
        const toTop= document.querySelector(".to-top-btn");
        if(window.scrollY > 100){
            return toTop.classList.add("active"); // stops the function here if true else continues
        }
        toTop.classList.remove("active");
    }
}


class Chart{
    static storeLocalStorage(){
        // checks if the data is on the localStorage and if true, stops this function
        if(localStorage.getItem("countriesData") !== null){
            return;
        }
        const xhr = new XMLHttpRequest();

        xhr.open("GET", "countries.json", true);

        xhr.onload = function (){
            let res = JSON.parse(this.responseText);

            localStorage.setItem("countriesData", JSON.stringify(res));
        }

        xhr.send();
    }

    static insertChartData(i, arr, total){ 
        const res = `
                    <div class="country-data">
                        <div class="country-data-name">${arr[i].name}</div>
                        <div class="country-data-bar" style="width:${Format.calculateWidth(arr[i].population, total)}"></div>
                        <div class="country-data-count">${arr[i].population}</div>
                    </div>
            `

        return res
    }

    static tenMostPopulatedCountries (){
        let countriesData = JSON.parse(localStorage.getItem("countriesData"));

        countriesData.sort((a,b) => b.population - a.population);

        // find the total population in the array
        let totalPopulation = countriesData.reduce((total, currentValue) => total + currentValue.population, 0);

        let res = `
                    <div class="country-data">
                        <div class="country-data-name">World</div>
                        <div class="country-data-bar" width="100%"></div>
                        <div class="country-data-count">${totalPopulation}</div>
                    </div>
        `;

        // add the content to the html
        for(let i = 0; i < 10; i++){
            res += Chart.insertChartData(i, countriesData, totalPopulation);
        }

        chartText.innerHTML = "10 Most Populated Countries";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res;
    }

    static searchedCountries(elem){
        // if the elem is empty, stop the function
        if(elem == ""){
            Chart.tenMostPopulatedCountries();
            return // this tells the browser to stop the function here if true
        }

        let countriesData = JSON.parse(localStorage.getItem("countriesData"));

        countriesData.sort((a,b) => b.population - a.population);

        // find the total population in the array
        let totalPopulation = countriesData.reduce((total, currentValue) => total + currentValue.population, 0);

        let res = `
                    <div class="country-data">
                        <div class="country-data-name">World</div>
                        <div class="country-data-bar" width="100%"></div>
                        <div class="country-data-count">${totalPopulation}</div>
                    </div>
        `;
        
        for(let i = 0; i < countriesData.length; i++){
            if(countriesData[i].name.toLowerCase().startsWith(elem)){
                res += Chart.insertChartData(i, countriesData, totalPopulation);
            }
        }

        chartText.innerHTML = "World Countries";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res;        
    }

    static searchedCapitalChart(elem){
        // if the elem is empty, stop the function
        if(elem == ""){
            Chart.tenMostPopulatedCountries();
            return // this tells the browser to stop the function here if true
        }

        let countriesData = JSON.parse(localStorage.getItem("countriesData"));

        countriesData.sort((a,b) => b.population - a.population);

        // find the total population in the array
        let totalPopulation = countriesData.reduce((total, currentValue) => total + currentValue.population, 0);

        let res = `
                    <div class="country-data">
                        <div class="country-data-name">World</div>
                        <div class="country-data-bar" width="100%"></div>
                        <div class="country-data-count">${totalPopulation}</div>
                    </div>
        `;
        
        for(let i = 0; i < countriesData.length; i++){
            // skip countries that have no capital in the data
            if(countriesData[i].capital === undefined){
                continue
            }

            if(countriesData[i].capital.toLowerCase().startsWith(elem)){
                res += Chart.insertChartData(i, countriesData, totalPopulation);
            }
        }

        chartText.innerHTML = "World Countries";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res;        
    }

    static countingLanguages(arr){
        // counting variable for number of languages 
        const count = {};

        // count the languages present
        arr.forEach((country) => {
            country.languages.forEach((lang) => {
                count[lang] = (count[lang] || 0) + 1
            })
        });

        // convert the count object to an array to sort it
        return Object.entries(count).sort((a, b) => b[1] - a[1]);
    }

    static tenMostUsedLanguages(){
        let countriesData = JSON.parse(localStorage.getItem("countriesData"));
        
        const languagesArray = Chart.countingLanguages(countriesData);

        let res = "";

        for(let i = 0; i < 10; i++){
                res += `
                        <div class="country-data">
                            <div class="country-data-name">${languagesArray[i][0]}</div>
                            <div class="country-data-bar" style="width:${Format.calculateWidth(languagesArray[i][1], languagesArray[0][1])}"></div>
                            <div class="country-data-count">${languagesArray[i][1]}</div>
                        </div>
                `
        }

        chartText.innerHTML = "10 Most Spoken Languages";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res; 
    }

    static searchedCountriesLanguages(elem){
        let countriesData = JSON.parse(localStorage.getItem("countriesData"));
        const selectedCountries = [];

        if(elem == ""){
            Chart.tenMostUsedLanguages();
            return // this tells the browser to stop the function here if true
        }

        // find the countries that fit the search paramenters then push them to selectedcountries
        for(let i = 0; i < countriesData.length; i++){
            if(countriesData[i].name.toLowerCase().startsWith(elem)){
                selectedCountries.push(countriesData[i]);
            }
        }

        const languagesArray = Chart.countingLanguages(selectedCountries);

        let res = "";
        
        for(let i = 0; i < languagesArray.length; i++) {            
            res += `
            <div class="country-data">
                <div class="country-data-name">${languagesArray[i][0]}</div>
                <div class="country-data-bar" style="width:${Format.calculateWidth(languagesArray[i][1], languagesArray[0][1])}"></div>
                <div class="country-data-count">${languagesArray[i][1]}</div>
            </div>
        `
        }

        chartText.innerHTML = "World Languages";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res;
    }

    static searchedCapitalLanguages(elem){
        let countriesData = JSON.parse(localStorage.getItem("countriesData"));
        const selectedCountries = [];

        if(elem == ""){
            Chart.tenMostUsedLanguages();
            return // this tells the browser to stop the function here if true
        }

        // find the countries that fit the search paramenters then push them to selectedcountries
        for(let i = 0; i < countriesData.length; i++){
            // if the capital does not exist in the data or if it matches our search value, push it
            if(countriesData[i].capital === undefined || countriesData[i].capital.toLowerCase().startsWith(elem)){
                selectedCountries.push(countriesData[i]);
            }
        }

        const languagesArray = Chart.countingLanguages(selectedCountries);

        let res = "";
        
        for(let i = 0; i < languagesArray.length; i++) {            
            res += `
            <div class="country-data">
                <div class="country-data-name">${languagesArray[i][0]}</div>
                <div class="country-data-bar" style="width:${Format.calculateWidth(languagesArray[i][1], languagesArray[0][1])}"></div>
                <div class="country-data-count">${languagesArray[i][1]}</div>
            </div>
        `
        }

        chartText.innerHTML = "World Languages";

        //append the countrycontainer to the chart section
        chartSection.innerHTML = res;
    }

    // show the corresponding chart based on the search value
    static showCountriesChart = (func, elem) => {
        const countriesData = JSON.parse(localStorage.getItem("countriesData"));

        let res = func(countriesData, elem);

        container.innerHTML = res;
        countriesCount.innerHTML = countriesData.length;
    }
}

// EVENTS


// when the document loads
document.addEventListener("DOMContentLoaded", () => {
    Chart.storeLocalStorage();
    UI.showCountriesData(UI.insertCountries);
    UI.searching(UI.findCountryName, Chart.searchedCountries);
    Chart.tenMostPopulatedCountries();
});

// show back to top btn when window goes down 100px
window.addEventListener("scroll", UI.scrollDown);


// click events
nameNavBtn.addEventListener("click", () => {    
    // checks if the first element country is alphabetically less than the last element and reverses the array
    // else it displays the array as it is in the api
    if(container.firstElementChild.querySelector(".country-name").textContent.toLowerCase() < container.lastElementChild.querySelector(".country-name").textContent.toLowerCase()){
        Format.changingArrowDir(nameArrow, 180)
        UI.showCountriesData(UI.findReversedCountryName, searchField.value);
        UI.searching(UI.findReversedCountryName, Chart.searchedCountries);
    } else {
        Format.changingArrowDir(nameArrow, 360)
        UI.showCountriesData(UI.findCountryName, searchField.value);
        UI.searching(UI.findCountryName, Chart.searchedCountries);
    }
})

capitalNavBtn.addEventListener("click", () => {
    // checks if the first element country is alphabetically less than the last element and reverses the array
    // else it displays the array as it is in the api
    
    if(container.firstElementChild.querySelector(".country-name").nextElementSibling.textContent.toLowerCase() < container.lastElementChild.querySelector(".country-name").nextElementSibling.textContent.toLowerCase()){
        Format.changingArrowDir(capitalArrow, 180);
        UI.showCountriesData(UI.findReversedCapital, searchField.value);
        UI.searching(UI.findReversedCapital, Chart.searchedCapitalChart);
    } else {
        Format.changingArrowDir(capitalArrow, 360);
        UI.showCountriesData(UI.findCapital, searchField.value);
        UI.searching(UI.findCapital, Chart.searchedCapitalChart);
    }

    chartLanguageNavBtn.addEventListener("click", () => {
        if(chartText.textContent === "10 Most Populated Countries" || chartText.textContent === "World Countries"){        
            Chart.searchedCapitalLanguages(searchField.value);
            UI.searching(UI.findCountryName, Chart.searchedCapitalLanguages);
        }
    })
    
    chartPopulationNavBtn.addEventListener("click", () => {
        if(chartText.textContent === "10 Most Spoken Languages" || chartText.textContent === "World Languages"){        
            Chart.searchedCapitalChart(searchField.value);
            UI.searching(UI.findCountryName, Chart.searchedCapitalChart);
        }
    })
})

populationNavBtn.addEventListener("click", () => {
    let firstElementPopulation = parseInt(container.firstElementChild.querySelector(".country-name").parentNode.lastElementChild.textContent.substring(12))
    let lastElementPopulation = parseInt(container.lastElementChild.querySelector(".country-name").parentNode.lastElementChild.textContent.substring(12))
    
    if (firstElementPopulation > lastElementPopulation){        
        Format.changingArrowDir(populationArrow, 360);
        UI.showCountriesData(UI.ascendingPopulation, searchField.value);
        UI.searching(UI.ascendingPopulation, Chart.searchedCountries);
    } else {
        Format.changingArrowDir(populationArrow, 180);
        UI.showCountriesData(UI.descendingPopulation, searchField.value);
        UI.searching(UI.descendingPopulation, Chart.searchedCountries);
    }
});

// to switch between the chart population and languages based on what is currently on screen
chartLanguageNavBtn.addEventListener("click", () => {
    if(chartText.textContent === "10 Most Populated Countries" || chartText.textContent === "World Countries"){        
        Chart.searchedCountriesLanguages(searchField.value);
        UI.searching(UI.findCountryName, Chart.searchedCountriesLanguages);
    }
})

chartPopulationNavBtn.addEventListener("click", () => {
    if(chartText.textContent === "10 Most Spoken Languages" || chartText.textContent === "World Languages"){        
        Chart.searchedCountries(searchField.value);
        UI.searching(UI.findCountryName, Chart.searchedCountries);
    }
});