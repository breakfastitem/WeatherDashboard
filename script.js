/**
 * Internal data structure
 * Array stores names of VALID searched cities
 */
var nameHistory = [];

/**
 *Global Functions
 */
//isRefresh=true prevents new list item creation
function displayWeatherStats(cityName, isRefresh) {

    var generalQueryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=29bee85b4cd6fced7d450f1d24d41a67";
    var fiveDayQueryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=29bee85b4cd6fced7d450f1d24d41a67";

    $.ajax({
        method: "GET",
        url: generalQueryUrl,
        error: function () {
            console.log("404 error do something");
        }
    }).then(function (response) {

        //updates Data only on new query
        if (!isRefresh) {
            nameHistory.push(cityName);

            localStorage.setItem("searched", JSON.stringify(nameHistory));
            //call render function based on data
            renderSearchList();
        }

        $("#details-header").text(cityName + " (" + moment().format("MM/D/YYYY") + ")");
        var icon = $(`<span><img src=http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png alt="weather icon"  ></img></span>`);
        $("#details-header").append(icon);

        $("#temp").text("Temperature: " + response.main.temp + " °F");
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#wind").text("Wind: " + response.wind.speed + " MPH");

        var uvQueryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=29bee85b4cd6fced7d450f1d24d41a67";

        $.ajax({
            method: "GET",
            url: uvQueryUrl
        }).then(function (uvResponse) {
            $("#uv").text("Uv Index: " + uvResponse.value);

        });

    });

    $.ajax({
        method: "GET",
        url: fiveDayQueryUrl,
        error: function () {
            console.log("404 error do something");
        }
    }).then(function (fiveDayResponse) {

        console.log(fiveDayResponse.list[0]);
        var indexOffset = 0;
        var found = false;

        //Find Day
        for (var j = 0; j < 40 && !found; j++) {
            var date = fiveDayResponse.list[j].dt_txt.split(" ")[0];
            if (date === moment().add(1, 'days').format("YYYY-MM-D")) {
                indexOffset = j;
                found = true;
            }

        }

        for (var i = 0; i < 5; i++) {
            
            //each day has 8 datpoints, adding 4 aims for early morning time 
            var index = (8 * i) + (indexOffset + 4);

            var dayDiv = $("#day-" + (i + 1));

            if (index >= 40) {
                index=39;
            }

            var date = $("<h5 class='card-title'>" + moment().add(i+1,"day").format("MM/D/YYYY") + "</h5>");
            
            var icon = $(`<img src=" http://openweathermap.org/img/wn/${fiveDayResponse.list[index].weather[0].icon}@2x.png" alt="weather icon">`);

            var temp = $("<p class='card-text'> Temp: " + fiveDayResponse.list[index].main.temp + "°F</p>");
            var humidity = $("<p class='card-text'> Humidity: " + fiveDayResponse.list[index].main.temp.toString().split(".")[0] + "%</p>");

            dayDiv.empty();

            dayDiv.append(date);
            dayDiv.append(icon);
            dayDiv.append(temp);
            dayDiv.append(humidity);

        }
    });

};

//renders search list from data

function renderSearchList() {
    $("#search-list").empty();

    //prevents list from growing infinitly

    while (nameHistory.length > 11) {
        nameHistory = nameHistory.slice(1);
    }


    for (var i = 0; i < nameHistory.length; i++) {

        var listItem = $("<li>");
        var button = $("<button></button>");
        button.attr("id", "city-" + i);
        button.text(nameHistory[i]);

        listItem.append(button);

        $("#search-list").prepend(listItem);
    }

};

/**
 * Event Handlers
 */
$("document").ready(function () {

    //select button functionality
    $("#search-button").on("click", function (event) {
        event.preventDefault();

        var cityInput = $("#search-input").val().trim();
        $("#search-input").val("");

        if (cityInput != "") {
            //makes name capital
            cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);

            displayWeatherStats(cityInput, false);

        }

    });

    $(".city-button").on("click", function (event) {

        var targetIndex = event.target.id.split("-")[1];

        displayWeatherStats(nameHistory[targetIndex], true);

    });

});

/**
 * Main
 */
var tempHistory = JSON.parse(localStorage.getItem("searched"));

if (tempHistory != null) {
    nameHistory = tempHistory;
}

renderSearchList();

if (nameHistory.length > 0) {
    displayWeatherStats(nameHistory[nameHistory.length - 1], true);
} else {
    displayWeatherStats("Cincinnati", true);
}