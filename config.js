/* Config Sample
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"],	// Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,			// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true

	language: "et",
	locale: "et-EE",   // this variable is provided as a consistent location
			   // it is currently only used by 3rd party modules. no MagicMirror code uses this value
			   // as we have no usage, we  have no constraints on what this field holds
			   // see https://en.wikipedia.org/wiki/Locale_(computer_software) for the possibilities

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar",
			ignoreModules: ["MMM-BME280"]
		},
		{
			module: "clock",
			position: "top_left"
		},
		{
			module: "MMM-RCWL0516",
			position: "top_left",
			config: {
			  displayTimeout: 30  // sekundi jooksul ilma liikumiseta ekraan läheb kinni
			}
		},		  
		{
			module: "calendar",
			header: "Eesti pühad",
			position: "top_left",
			config: {
				maximumEntries: 5,
				displaySymbol: false,
				fadePoint: 0.75,
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
						url: "https://calendar.google.com/calendar/ical/en.ee%23holiday%40group.v.calendar.google.com/public/basic.ics"
					}
				]
			}
		},
		{
			module: "MMM-EUElectricityPrice",
			position: "top_left",
			config: {
			headText: 'Electricity Price',
			dataSource: 'EE', 
			currency: 'EUR', 
			chartType: 'bar', //can be 'bar' or 'line' (line looks good when module is placed in e.g 'bottom_center')
        	}
    	},	
		//{
		//	module: "compliments",
		//	position: "lower_third"
		//},
		{	// Praegune ilm
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openmeteo",
				type: "current",
				onlyTemp: true,
				showUVIndex: true,
				units: "metric",		
				lat: 59.436962,
				lon: 24.753574
			}
		},
		{	// Tulevane ilma
			module: "weather",
			position: "top_right",
			header: "Tulevane ilm",
			config: {
				weatherProvider: "openmeteo",
				type: "daily",
				colored: true,
				initialLoadDelay: 1000,
				updateInterval: 300000,
				lat: 59.436962,
				lon: 24.753574
			}
		},
		{
			module: "MMM-RoomData",
			position: "top_right", // või vali muu sobiv positsioon
			config: {
				serialPort: "/dev/serial0",
				baudRate: 9600,
				updateInterval: 1, // sekundites
				temperatureScaleType: 0 // 0 = °C, 1 = °F
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				feeds: [
					{
						title: "New York Times",
						url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
					}
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
