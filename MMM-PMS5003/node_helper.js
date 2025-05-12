const NodeHelper = require("node_helper");
const exec = require("child_process").exec;

module.exports = NodeHelper.create({
    start: function () {
        console.log("MMM-PMS5003 helper started ...");
    },

    socketNotificationReceived: function (notification, payload) {
        console.log("node_helper sai socketNotificationi:", notification, payload);
        const self = this;
        if (notification === "GET_PM_DATA") {
            const serialPort = payload.serialPort;

            exec(`python3 ./modules/MMM-PMS5003/pms5003_test.py ${serialPort}`, (error, stdout) => {
                console.log("Python skript lõpetas, stdout:", stdout);
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }

                try {
                    const jsonData = JSON.parse(stdout);
                    if (jsonData.error) {
                        console.error("Python error:", jsonData.error);
                        return;
                    }

                    self.sendSocketNotification("PM_DATA", {
                        pm25: jsonData.pm2_5,
                        pm10: jsonData.pm10
                    });
                } catch (e) {
                    console.error("JSON parse error:", e);
                }
            });
        }
    }
});
