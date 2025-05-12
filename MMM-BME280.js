Module.register("MMM-BME680", {
    // Default module config.
    defaults: {
        updateInterval: 100, // Seconds
        titleText: "Home weather",
        deviceAddress: "0x77",
        temperatureScaleType: 0, // Celsius
    },

    // Define start sequence.
    start: function () {
        Log.info("Starting module: " + this.name);

        this.temperature = 'Loading...';
        this.humidity = 'Loading...';

        this.update();
        setInterval(
            this.update.bind(this),
            this.config.updateInterval * 1000);
    },

    update: function () {
        this.sendSocketNotification('REQUEST', this.config);
    },

    getStyles: function () {
        return ['MMM-BME680.css'];
    },

    // Override dom generator.
    getDom: function () {
        var wrapper = document.createElement("div");

        var header = document.createElement("div");
        var label = document.createTextNode(this.config.titleText);
        header.className = 'bme-header';
        header.appendChild(label)
        wrapper.appendChild(header);

        var table = document.createElement("table");
        var tbdy = document.createElement('tbody');
        for (var i = 0; i < 3; i++) {
            var val = "";
            var sufix = "";
            var icon_img = "";

            switch (i) {
                case 0:
                    switch (this.config.temperatureScaleType) {
                        case 0: // Celsius
                            val = this.temperature;
                            sufix = "°C";
                            break;
                        case 1: // Fahrenheit
                            val = Math.round(this.temperature * 9.0 / 5.0 + 32.0);
                            sufix = "°F";
                            break;
                    }
                    icon_img = "temperature-high";
                    break;
                case 1:
                    val = this.humidity;
                    icon_img = "tint";
                    sufix = "%";
                    break;
            }

            var tr = document.createElement('tr');
            var icon = document.createElement("i");

            icon.className = 'fa fa-' + icon_img + ' bme-icon';

            var text_div = document.createElement("div");
            var text = document.createTextNode(" " + val + sufix);
            text_div.className = 'bme-text';
            text_div.appendChild(text);

            var td = document.createElement('td');
            td.className = 'bme-td-icon';
            td.appendChild(icon)
            tr.appendChild(td)

            var td = document.createElement('td');
            td.appendChild(text_div)
            tr.appendChild(td)

            tbdy.appendChild(tr);
        }
        table.appendChild(tbdy);
        wrapper.appendChild(table);

        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === 'DATA') {
            this.temperature = payload.temp;
            this.humidity = payload.humidity;
            this.updateDom();
        }
    },
});
