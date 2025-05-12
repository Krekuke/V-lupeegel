Module.register("MMM-RoomData", {
    defaults: {
        updateInterval: 60, // sekundites
        serialPort: "/dev/serial0",
        baudRate: 9600,
        temperatureScaleType: 0, // 0 = Celsius
    },

    start: function () {
        Log.info("Käivitan mooduli: " + this.name);
        this.temperature = null;
        this.humidity = null;
        this.pm25 = null;
        this.pm10 = null;
        this.updateSensors();
        setInterval(this.updateSensors.bind(this), this.config.updateInterval * 1000);
    },

    updateSensors: function () {
        this.sendSocketNotification('GET_BME_DATA', this.config);
        this.sendSocketNotification("GET_PM_DATA", {
            serialPort: this.config.serialPort,
            baudRate: this.config.baudRate
        });
    },

    getStyles: function () {
        return ['font-awesome.css'];
    },
    
    getDom: function () {
        var wrapper = document.createElement("div");

        // BME680 Andmed
        var bmeHeader = document.createElement("div");
        bmeHeader.innerHTML = "<strong>Ilmaandmed:</strong>";
        wrapper.appendChild(bmeHeader);

        var weatherTable = document.createElement("table");
        var tbdy = document.createElement("tbody");
        
        const weatherRows = [
            {
                icon: "fa-thermometer-half",
                value: this.temperature !== null
                    ? `${this.temperature}${this.config.temperatureScaleType === 1 ? " °F" : " °C"}`
                    : "Laen..."
            },
            {
                icon: "fa-tint",
                value: this.humidity !== null
                    ? `${this.humidity} %`
                    : "Laen..."
            }
        ];
        
        weatherRows.forEach(row => {
            var tr = document.createElement("tr");
        
            var iconTd = document.createElement("td");
            var icon = document.createElement("i");
            icon.className = `fa ${row.icon}`;
            icon.style.marginRight = "10px";
            iconTd.appendChild(icon);
            tr.appendChild(iconTd);
        
            var valueTd = document.createElement("td");
            valueTd.innerHTML = row.value;
            tr.appendChild(valueTd);
        
            tbdy.appendChild(tr);
        });
        
        weatherTable.appendChild(tbdy);
        wrapper.appendChild(weatherTable);
        

        // PMS5003 Andmed
        var pmHeader = document.createElement("div");
        pmHeader.innerHTML = "<br><strong>Õhukvaliteet:</strong>";
        wrapper.appendChild(pmHeader);

        if (this.pm25 !== null && this.pm10 !== null) {
            const avgValue = (this.pm25 + this.pm10) / 2;
            const airQuality = this.getCombinedAirQualityText(avgValue);

            const airDiv = document.createElement("div");
            airDiv.innerHTML = airQuality.text;
            airDiv.style.color = airQuality.color;
            airDiv.style.fontWeight = "bold";
            airDiv.style.fontSize = "1.2em";

            wrapper.appendChild(airDiv);
        } else {
            var loading = document.createElement("div");
            loading.innerHTML = "Ootan õhukvaliteedi andmeid...";
            wrapper.appendChild(loading);
        }

        return wrapper;
    },

    getAirQualityText: function (value, type) {
        let rating = { text: "", color: "black" };

        if (type === "PM2.5") {
            if (value <= 12) rating = { text: "Puhas", color: "green" };
            else if (value <= 35) rating = { text: "Keskmine", color: "orange" };
            else if (value <= 55) rating = { text: "Kehv", color: "red" };
            else if (value <= 150) rating = { text: "Väga kehv", color: "darkred" };
            else rating = { text: "Ohtlik", color: "purple" };
        } else if (type === "PM10") {
            if (value <= 20) rating = { text: "Puhas", color: "green" };
            else if (value <= 50) rating = { text: "Keskmine", color: "orange" };
            else if (value <= 100) rating = { text: "Kehv", color: "red" };
            else if (value <= 200) rating = { text: "Väga kehv", color: "darkred" };
            else rating = { text: "Ohtlik", color: "purple" };
        }

        return rating;
    },
    getCombinedAirQualityText: function (value) {
        if (value <= 15) return { text: "Puhas", color: "white" };
        if (value <= 35) return { text: "Hea", color: "#3399ff" }; // sinine
        if (value <= 55) return { text: "Keskmine", color: "#ffcc00" }; // kollane
        if (value <= 100) return { text: "Kehv", color: "#ff6600" }; // oranž
        return { text: "Väga kehv", color: "#cc0000" }; // punane
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'BME_DATA') {
            this.temperature = this.config.temperatureScaleType === 1
                ? Math.round(payload.temp * 9 / 5 + 32)
                : payload.temp;
            this.humidity = payload.humidity;
            this.updateDom();
        }

        if (notification === "PM_DATA") {
            this.pm25 = parseFloat(payload.pm25);
            this.pm10 = parseFloat(payload.pm10);
            this.updateDom();
        }
    }
});
