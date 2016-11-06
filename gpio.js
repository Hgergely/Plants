var gpio = require('rpi-gpio');
var sleep = require('sleep');
var nodemailer = require('nodemailer');
var sensor = require('node-dht-sensor');

var alreadyNoticed = false;

console.log("Measuring Soil Moisture...")


gpio.on('change', function(channel, dryedOut) {

	if (dryedOut && !alreadyNoticed){

		alreadyNoticed = true
		console.log("Water now");
		sendEmail("needwater")
		
	}


	if (!dryedOut && !alreadyNoticed){

		alreadyNoticed = true
		console.log("Water now");
		sendEmail("itshappy")
		
	}
    
});


gpio.setup(11, gpio.DIR_IN, gpio.EDGE_BOTH);


function sendEmail(status){

	var TempText = ""
	sensor.read(22, 4, function(err, temperature, humidity) {
	    if (!err) {
	        console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
	            'humidity: ' + humidity.toFixed(1) + '%'
	        );

	        TempText = 	'Current Temperature: ' + temperature.toFixed(1) + '°C, \n' +
	            		'Current Humidity: ' + humidity.toFixed(1) + '% \n';

		        var transporter = nodemailer.createTransport('smtps://gergely.hajcsak@gmail.com:Hg3rg3ly1357@smtp.gmail.com');
		 
				// setup e-mail data with unicode symbols 

				if (status=="itshappy"){

					var mailOptions = {
				    from: '"My Plant" <gergely.hajcsak@gmail.com>', // sender address 
				    to: 'gergely.hajcsak@gmail.com', // list of receivers 
				    subject: 'Soli Moisture is watered now ✿ ', // Subject line 
				    text: 'Your plant is watered now ✿. \n You plant is happy :) \n\n' + TempText, // plaintext body 
				    //html: '<b>Hello world 🐴</b>' // html body 
					};

				}else{
					
					var mailOptions = {
				    from: '"My Plant" <gergely.hajcsak@gmail.com>', // sender address 
				    to: 'gergely.hajcsak@gmail.com', // list of receivers 
				    subject: 'Soli Moisture Status ✿ ', // Subject line 
				    text: 'Your plant\'s soil needs to be watered \n\n' + TempText, // plaintext body 
				    //html: '<b>Hello world 🐴</b>' // html body 
					};

				}
			
				 
				// send mail with defined transport object 
				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        return console.log(error);
				    }
				    console.log('Message sent: ' + info.response);
				    process.exit()
				});
		}
	});


}
 
