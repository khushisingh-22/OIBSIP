function convertTemperature() {

    let input = document.getElementById("tempInput").value.trim();
    let unit = document.getElementById("unit").value;

    let error = document.getElementById("error");

    let c = document.getElementById("celsius");
    let f = document.getElementById("fahrenheit");
    let k = document.getElementById("kelvin");

    error.innerHTML = "";
    c.innerHTML = "";
    f.innerHTML = "";
    k.innerHTML = "";

    if(input === "" || isNaN(input)){
        error.innerHTML = "Please enter a valid numeric value.";
        return;
    }

    input = Number(input);

    let celsius, fahrenheit, kelvin;

    if(unit === "C"){
        if(input < -273.15){
            error.innerHTML = "Temperature cannot be below absolute zero (-273.15°C).";
            return;
        }

        celsius = input;
        fahrenheit = (input * 9/5) + 32;
        kelvin = input + 273.15;
    }

    else if(unit === "F"){

        if(input < -459.67){
            error.innerHTML = "Temperature cannot be below absolute zero (-459.67°F).";
            return;
        }

        celsius = (input - 32) * 5/9;
        fahrenheit = input;
        kelvin = celsius + 273.15;
    }

    else{

        if(input < 0){
            error.innerHTML = "Temperature cannot be below absolute zero (0 K).";
            return;
        }

        kelvin = input;
        celsius = input - 273.15;
        fahrenheit = (celsius * 9/5) + 32;
    }

    c.innerHTML = `🌡 Celsius : ${celsius.toFixed(2)} °C`;
    f.innerHTML = `🔥 Fahrenheit : ${fahrenheit.toFixed(2)} °F`;
    k.innerHTML = `❄ Kelvin : ${kelvin.toFixed(2)} K`;
}