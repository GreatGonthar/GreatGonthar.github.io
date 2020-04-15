// Начало проекта 6,04,20


let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
let appleX;
let appleY;
let numbersApple = 0;
let snakeLong = [[0,300],[20,300]];
let snakeX ;
let snakeY ;


myCanvas.width = 800;
myCanvas.height = 600;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
let directionX = 1;
let directionY = 0;

function mainLoop(){	
		
	drawPlayer();
	apple();
	death();

}

function drawPlayer(){
	snakeX = snakeLong[snakeLong.length-1][0];
	snakeY = snakeLong[snakeLong.length-1][1];
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);	
	snakeLong.push([snakeX+(20 * directionX), snakeY+(20 * directionY)]);	

	if (snakeX != appleX || snakeY != appleY){snakeLong.shift()};	

		for (let i = 0; i < (snakeLong.length-1); i++){
			ctx.fillStyle = 'white';
			ctx.fillRect(snakeLong[i][0], snakeLong[i][1], 20, 20);	
		}

	(snakeX > myCanvas.width) ? snakeLong[snakeLong.length-1][0] = 0: true;
	(snakeX < 0) ? snakeLong[snakeLong.length-1][0] = myCanvas.width: true;
	(snakeY > myCanvas.height) ? snakeLong[snakeLong.length-1][1] = 0: true;
	(snakeY < 0) ? snakeLong[snakeLong.length-1][1] = myCanvas.height: true;	
}

function death(){
	for (let i = 0; i < (snakeLong.length-1); i++){
		console.log(snakeLong[0][0])
		if (snakeLong[(snakeLong.length-1)][0] == snakeLong[i][0] && snakeLong[(snakeLong.length-1)][1] == snakeLong[i][1]){			
			alert('заново')
			snakeLong = [[0,300],[20,300]]
			directionX = 1;
			directionY = 0;
		}
	}
}

function apple(){
	if (snakeX == appleX && snakeY == appleY){numbersApple = 0;}	

	if (numbersApple < 1){
		appleX = Math.floor(Math.random()*(myCanvas.width/20))*20;
		appleY = Math.floor(Math.random()*(myCanvas.height/20))*20;	
		numbersApple += 1;
	}
	ctx.fillStyle = 'red';
	ctx.fillRect(appleX, appleY, 20, 20);
}

function keyMovePlayer(e){	
	switch (e.keyCode) {
		case 37:
			console.log(e.keyCode);
			(directionX != 1) ? directionX = -1: true;
			directionY = 0;			
			break;
		case 38:
			console.log(e.keyCode);		
			(directionY != 1) ? directionY = -1: true;	
			directionX = 0;	
			break;	
		case 39:
			console.log(e.keyCode);
			(directionX != -1) ? directionX = 1: true;
			directionY = 0;			
			break;
		case 40:
			console.log(e.keyCode);
			(directionY != -1) ? directionY = 1: true;
			directionX = 0;
			break;	
	}		
}
addEventListener("keydown", keyMovePlayer);
// Проверить доступность и назначить обработчик событий датчика-акселерометра
if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', motion_hook, false);
}
else {
    // DeviceMotionEvent не поддерживается
}
 
// Обработчик события DeviceMotionEvent
function motion_hook(event) {
    console.log('Accelerometer: '
        + 'X=' + event.accelerationIncludingGravity.x
        + 'Y=' + event.accelerationIncludingGravity.y
        + 'Z=' + event.accelerationIncludingGravity.z
    );
    if (event.accelerationIncludingGravity.x > 90){directionX = 1}
    if (event.accelerationIncludingGravity.x < 90){directionX = -1}
    if (event.accelerationIncludingGravity.y > 90){directionX = 1}
    if (event.accelerationIncludingGravity.y > 90){directionX = -1}	
    
}


setInterval(mainLoop, 100);