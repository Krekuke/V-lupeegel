// Importige vajalikud moodulid
const NodeHelper = require("node_helper");
const { spawn, exec } = require("child_process");

let timeoutHandle = null; // Muutuja ajutise taimeri hoidmiseks

module.exports = NodeHelper.create({
    // Mooduli käivitamisel kutsutakse üles liikumisanduri töötlemise funktsioon
    start: function () {
        console.log("Starting node helper for MMM-RCWL0516");
        this.runMotionSensor(); // Käivitab liikumisanduri kontrollimise
    },

    // Funktsioon, mis käivitab Python skripti, mis kontrollib liikumist
    runMotionSensor: function () {
        // Käivitame Python skripti (rcwl-0516.py) liikumisanduri lugemiseks
        const process = spawn("python3", [__dirname + "/rcwl-0516.py"]);

        // Kui Python skript väljastab andmeid, siis töötleme neid
        process.stdout.on("data", (data) => {
            const message = data.toString().trim();
            
            // Kui tuvastatakse liikumine, lülitame ekraani sisse
            if (message === "MOTION_DETECTED") {
                console.log("🚶 Liikumine tuvastatud! Ekraan sisse.");
                this.toggleDisplay(true); // Ekraani sisse lülitamine
            } 
            // Kui liikumist pole, lülitame ekraani välja
            else if (message === "NO_MOTION") {
                console.log("💤 Liikumist pole. Ekraan välja.");
                this.toggleDisplay(false); // Ekraani välja lülitamine
            }
        });

        // Kui Python skript väljastab vea, logime selle
        process.stderr.on("data", (data) => {
            console.error(`Error: ${data}`);
        });

        // Kui Python skript lõppeb, logime selle lõppemise koodi
        process.on("close", (code) => {
            console.log(`Python script exited with code ${code}`);
        });
    },

    // Funktsioon, mis kuulab saabunud sõnumeid ja määrab konfigureerimisandmed
    notificationReceived: function (notification, payload, sender) {
        if (notification === "DOM_OBJECTS_CREATED") {
            this.sendSocketNotification("SET_CONFIG", this.config); // Saadab konfigureerimise andmed
        }
    },

    // Funktsioon ekraani sisselülitamiseks ja väljalülitamiseks
    toggleDisplay: function (powerOn) {
        // Kui liikumine tuvastati, lülitame ekraani sisse
        // Kui liikumist pole, lülitame ekraani välja
        const cmd = powerOn 
            ? "sudo /usr/bin/wlr-randr --output HDMI-A-1 --on" 
            : "wlr-randr --output HDMI-A-1 --off"; // Ekraani lülitamise käsk

        // Käivitame süsteemikäsu, et ekraani sisse või välja lülitada
        exec(cmd, (error, stdout, stderr) => {
            console.log(`⚡ Käsk käivitub: ${cmd}`);
            
            // Kui käsk lõpeb veaga, logime vea
            if (error) {
                console.error(`Exec viga: ${error.message}`);
                return;
            }
            // Kui käsk väljastab vigu, logime need
            if (stderr) {
                console.error(`Exec stderr: ${stderr}`);
                return;
            }
            // Kui käsk õnnestub, logime süsteemi väljundi
            console.log(`Exec väljund: ${stdout}`);
        });
    }
});
