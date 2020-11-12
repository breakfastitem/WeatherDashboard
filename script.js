function displayWeatherStats(cityName,stateName){

    var generalQueryUrl = "http://api.openweathermap.org/data/2.5/weather?q="+ cityName +","+ stateName +"&units=imperial&appid=29bee85b4cd6fced7d450f1d24d41a67";
    var fiveDayQueryUrl="http://api.openweathermap.org/data/2.5/forecast?q="+cityName+"&appid=29bee85b4cd6fced7d450f1d24d41a67";

    $.ajax({
        method:"GET",
        url:generalQueryUrl
    }).then(function(response){

        $("#details-header").text(cityName);
        $("#temp").text("Temperature: "+ response.main.temp+ " °F");
        $("#humidity").text("Humidity: "+response.main.humidity+"%");
        $("#wind").text("Wind: "+response.wind.speed+" MPH");

        var uvQueryUrl = "http://api.openweathermap.org/data/2.5/uvi?lat="+ response.coord.lat +"&lon="+ response.coord.lon +"&appid=29bee85b4cd6fced7d450f1d24d41a67";

        $.ajax({
            method:"GET",
            url:uvQueryUrl
        }).then(function(uvResponse){
            $("#uv").text("Uv Index: "+uvResponse.value);

        });

    });

    $.ajax({
        method:"GET",
        url:fiveDayQueryUrl
    }).then( function(fiveDayResponse){
        console.log("hjhjk");
        console.log(fiveDayResponse);
    });

}

displayWeatherStats("Cincinnati","ohio");
