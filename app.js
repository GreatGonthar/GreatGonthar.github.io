// Начало проекта 6,04,20


let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
let snakeX = 0;
let snakeY = 300;
let cleaner = [];
let snakeLong = 20;


myCanvas.width = 800;
myCanvas.height = 600;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
let directionX = 1;
let directionY = 0;

function drawPlayer(){
	death();
	ctx.fillStyle = 'green';
	ctx.fillRect(snakeX, snakeY, 20, 20);
	if (cleaner.length < snakeLong){
		cleaner.push([snakeX, snakeY]);		
	}
	snakeX += 20 * directionX;
	snakeY += 20 * directionY;

	(snakeX > myCanvas.width) ? snakeX = 0: true;
	(snakeX < 0) ? snakeX = myCanvas.width: true;
	(snakeY > myCanvas.height) ? snakeY = 0: true;
	(snakeY < 0) ? snakeY = myCanvas.height: true;
	drawCleaner();
	
}

function drawCleaner(){	
	if (cleaner.length >= snakeLong){
		ctx.fillStyle = 'black';
		ctx.fillRect(cleaner[0][0], cleaner[0][1], 20, 20);				
		cleaner.shift();
		
	}
}
function death(){
	for (let body of cleaner) {
		if (snakeX == body[0] && snakeY == body[1]){
  			alert('конец');
  			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
			snakeX = 0;
			snakeY = 300;
			directionX = 1;
			directionY = 0;
  		}
	}
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
		case 32:
			console.log(cleaner.length);
	}		
}
addEventListener("keydown", keyMovePlayer);

setInterval(drawPlayer, 100);