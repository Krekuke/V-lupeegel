Module.register("MMM-PMS5003", {
    defaults: {
        serialPort: "/dev/serial0",
        baudRate: 9600,
        updateInterval: 2 * 1000, // Iga 10 minuti järel uuendatakse
        goodAirColor: "green",
        badAirColor: "red"
    },

    start: function() {
        console.log("MMM-PMS5003 moodul käivitus");
        this.pm25 = null;
        this.pm10 = null;
        this.getData();
        this.scheduleUpdate();
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        if (this.pm25 !== null && this.pm10 !== null) {
            var pm25Div = document.createElement("div");
            pm25Div.innerHTML = "PM2.5: " + this.pm25 + " µg/m³";
            pm25Div.style.color = this.pm25 < 25 ? this.config.goodAirColor : this.config.badAirColor; // Muuda värvi vastavalt väärtusele

            var pm10Div = document.createElement("div");
            pm10Div.innerHTML = "PM10: " + this.pm10 + " µg/m³";
            pm10Div.style.color = this.pm10 < 50 ? this.config.goodAirColor : this.config.badAirColor; // Muuda värvi vastavalt väärtusele

            wrapper.appendChild(pm25Div);
            wrapper.appendChild(pm10Div);
        } else {
            wrapper.innerHTML = "Ootan andmeid...";
        }

        return wrapper;
    },

    getData: function() {
        console.log("Saadan päringu node_helperile...");
        this.sendSocketNotification("GET_PM_DATA", {
            serialPort: this.config.serialPort,
            baudRate: this.config.baudRate
        });
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        console.log("Sain socketNotificationi:", notification, payload);
        if (notification === "PM_DATA") {
            this.pm25 = payload.pm25;
            this.pm10 = payload.pm10;
            this.updateDom();
        }
    }
});