const NodeHelper = require("node_helper");
const { exec } = require("child_process");

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        if (notification === "GET_BME_DATA") {
            exec("python3 modules/MMM-BME680/bme680.py", (error, stdout, stderr) => {
                if (error) {
                    console.error("BME680 error:", stderr);
                    return;
                }
                try {
                    const data = JSON.parse(stdout);
                    this.sendSocketNotification("BME_DATA", {
                        temp: data.temperature,
                        humidity: data.humidity
                    });
                } catch (e) {
                    console.error("JSON parse error (BME):", e);
                }
            });
        }

        if (notification === "GET_PM_DATA") {
            const command = `python3 modules/MMM-PMS5003/pms5003_test.py ${payload.serialPort}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("PMS5003 error:", stderr);
                    return;
                }
                try {
                    const data = JSON.parse(stdout);
                    if (!data.error) {
                        this.sendSocketNotification("PM_DATA", {
                            pm25: data.pm2_5,
                            pm10: data.pm10
                        });
                    }
                } catch (e) {
                    console.error("JSON parse error (PMS):", e);
                }
            });
        }
    }
});
