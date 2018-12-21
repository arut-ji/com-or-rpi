require('dotenv').config();
const mqtt = require('mqtt');
const url = require('url');
const http = require('http');
const exec = require('child_process').exec;

const port = process.env.PORT;
const mqttURL = process.env.CLOUDMQTT_URL;
const topic = process.env.CLOUDMQTT_TOPIC;

console.log(port);
console.log(mqttURL);
console.log(topic);

const client = mqtt.connect(mqttURL);

const server = http.createServer(() => {});
let beforeDoorStatus = false;
let beforeBedroomLightStatus = false;
let beforeBathroomLightStatus = false;

server.listen(port, (err) => {
	if(err) console.error(err);
	else {
		console.log(`Server is listening on ${port}`);
		client.subscribe(topic, () => {
			client.on('message', (topicName, message, packet) => {
				const result = JSON.parse(message.toString());
				handleRoomOperation(result)
				
			})
		})
	}
		
})

function handleRoomOperation(roomDetail) {
	const doorStatus = roomDetail['doorStatus'];
	let bedroomLightStatus = roomDetail['bedroomLightStatus'];
	let bathroomLightStatus = roomDetail['bathroomLightStatus'];
	
	// Handling door operation
	if(doorStatus) {
		exec('sudo ./asm-command/lock', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});		
	} else if(!doorStatus) {
		exec('sudo ./asm-command/unlock', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});
	}
	
	// Handling the bedroom light operation
	if(bedroomLightStatus) {
		exec('sudo ./asm-command/bedroomLightOn', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});		
	} else if(!bedroomLightStatus) {
		exec('sudo ./asm-command/bedroomLightOff', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});
	}
	
	// Handling the bathroom light operation
	if(bathroomLightStatus) {
		exec('sudo ./asm-command/bathroomLightOn', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});		
	} else if(!bathroomLightStatus) {
		exec('sudo ./asm-command/bathroomLightOff', (err, stdout, stderr) => {
			if(err)console.error(err);
			console.log(stdout);
		});
	}
	
}


