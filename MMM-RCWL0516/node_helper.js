const NodeHelper = require("node_helper");
const { spawn, exec } = require("child_process");

let timeoutHandle = null; // Taimeri viide hilisemaks tühistamiseks

module.exports = NodeHelper.create({
    start: function () {
        console.log("✅ Alustan MMM-RCWL0516 NodeHelperit");
        this.config = {}; // Konfiguratsiooni hoidmine
        this.runMotionSensor();
    },

    // Käivitab taustal liikumisanduri Python-skripti
    runMotionSensor: function () {
        const process = spawn("python3", [__dirname + "/rcwl-0516.py"]);

        // Kui skript saadab andmeid (liikumine / mitte-liikumine)
        process.stdout.on("data", (data) => {
            const message = data.toString().trim();

            if (message === "MOTION_DETECTED") {
                console.log("🚶 Liikumine tuvastatud! Ekraan sisse.");
                this.toggleDisplay(true);

                // Kui eelmine taimer oli töös, tühista see
                if (timeoutHandle) clearTimeout(timeoutHandle);

                // Sea uus taimer ekraani väljalülitamiseks
                const timeout = (this.config.displayTimeout || 30) * 1000;
                timeoutHandle = setTimeout(() => {
                    console.log("⌛ Aeg läbi. Ekraan välja.");
                    this.toggleDisplay(false);
                }, timeout);
            }
        });

        process.stderr.on("data", (data) => {
            console.error(`❗ Python viga: ${data}`);
        });

        process.on("close", (code) => {
            console.log(`❌ Python skript lõpetas töö. Väljumiskood: ${code}`);
        });
    },

    // Ekraani sisse/välja lülitamine vastava käsuga
    toggleDisplay: function (powerOn) {
        const cmd = powerOn
            ? "wlr-randr --output HDMI-A-1 --on"
            : "wlr-randr --output HDMI-A-1 --off";

        exec(cmd, (error, stdout, stderr) => {
            console.log(`⚡ Käivitan käsu: ${cmd}`);
            if (error) {
                console.error(`❗ Exec viga: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠️ Exec stderr: ${stderr}`);
                return;
            }
            console.log(`✅ Exec väljund: ${stdout}`);
        });
    },

    // Võtab vastu konfiguratsiooni peamoodulist
    socketNotificationReceived: function (notification, payload) {
        if (notification === "SET_CONFIG") {
            this.config = payload;
            console.log("🔧 Konfiguratsioon saadud:", this.config);
        }
    }
});
