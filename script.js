var nameHistory = [];
function displayWeatherStats(cityName) {

    var generalQueryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=29bee85b4cd6fced7d450f1d24d41a67";
    var fiveDayQueryUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=29bee85b4cd6fced7d450f1d24d41a67";

    $.ajax({
        method: "GET",
        url: generalQueryUrl
    }).then(function (response) {

        $("#details-header").text(cityName + " (" + moment().format("MM/D/YYYY") + ")");
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
        url: fiveDayQueryUrl
    }).then(function (fiveDayResponse) {

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

            if (index < 40) {
                var date = $("<h5 class='card-title'>" + fiveDayResponse.list[index].dt_txt.split(" ")[0] + "</h5>");
                var icon = $("<img>");
                var temp = $("<p class='card-text'> Temperature:" + fiveDayResponse.list[index].main.temp + "°F</p>");
                var humidity = $("<p class='card-text'> Humidity:" + fiveDayResponse.list[index].main.temp + "%</p>");
            } else {
                var date = $("<h5 class='card-title'>" + fiveDayResponse.list[39].dt_txt.split(" ")[0] + "</h5>");
                var icon = $("<img>");
                var temp = $("<p class='card-text'> Temperature:" + fiveDayResponse.list[39].main.temp + "°F</p>");
                var humidity = $("<p class='card-text'> Humidity:" + fiveDayResponse.list[39].main.temp + "%</p>");
            }
            dayDiv.empty();

            dayDiv.append(date);
            dayDiv.append(icon);
            dayDiv.append(temp);
            dayDiv.append(humidity);

        }
    });

}
$("document").ready(function () {

    //select button functionality
    $("#search-button").on("click", function (event) {
        event.preventDefault();

        var cityInput = $("#search-input").val().trim();
        $("#search-input").val("");

        if (cityInput != "") {
            //makes name capital
            cityInput = cityInput.charAt(0).toUpperCase() + cityInput.slice(1);

            displayWeatherStats(cityInput);

            //determine ir 404 occured

            var listItem = $("<li>");
            var button = $("<button></button>");
            button.attr("id", "city-" + nameHistory.length);
            button.text(cityInput);

            listItem.append(button);
            nameHistory.push(cityInput);

            $("#search-list").prepend(listItem);

        }

    });

    $(".city-button").on("click", function(event) {

        var targetIndex = event.target.id.split("-")[1];
     
        displayWeatherStats(nameHistory[targetIndex]);

    });

});



displayWeatherStats("Cincinnati");
