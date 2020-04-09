// Начало проекта 6,04,20


let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
let snakeX = 0;
let snakeY = 300;
let cleaner = [];
let snakeLong = 5;
let appleX;
let appleY;
let numbersApple = 0;

let snakeLong2 = [[20,300],[40,300],[60,300]]


myCanvas.width = 800;
myCanvas.height = 600;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
let directionX = 1;
let directionY = 0;

function mainLoop(){	
	death2();
			
	//drawPlayer();
	//drawCleaner();
	drawPlayer2();
	apple();

}

function drawPlayer2(){


	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
	let snakeXYmax = snakeLong2[snakeLong2.length-1];	
	snakeX = snakeLong2[snakeLong2.length-1][0];
	snakeY = snakeLong2[snakeLong2.length-1][1]
	snakeLong2.push([snakeX+(20 * directionX), snakeY+(20 * directionY)]);	
	

	if (snakeX != appleX || snakeY != appleY){snakeLong2.shift()};	


		for (let i = 0; i < (snakeLong2.length-1); i++){
		ctx.fillStyle = 'green';
		ctx.fillRect(snakeLong2[i][0], snakeLong2[i][1], 20, 20);	

	}

	(snakeX > myCanvas.width) ? snakeLong2[snakeLong2.length-1][0] = 0: true;
	(snakeX < 0) ? snakeLong2[snakeLong2.length-1][0] = myCanvas.width: true;
	(snakeY > myCanvas.height) ? snakeLong2[snakeLong2.length-1][1] = 0: true;
	(snakeY < 0) ? snakeLong2[snakeLong2.length-1][1] = myCanvas.height: true;	
	//console.log(snakeX);



	

}

function drawPlayer(){
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
}

function drawCleaner(){	
	if (cleaner.length >= snakeLong){
		ctx.fillStyle = 'black';
		ctx.fillRect(cleaner[0][0], cleaner[0][1], 20, 20);				
		cleaner.shift();		
	}
}

function death2(){
	for (let i = 0; i < (snakeLong2.length-1); i++){
		if (snakeLong2[snakeLong2.length-1][0] == snakeLong2[i][0] && snakeLong2[snakeLong2.length-1][1] == snakeLong2[i][1]){
			alert('конец');
		}
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

function apple(){
	if (snakeX == appleX && snakeY == appleY){
	numbersApple = 0;	
	}	

	if (numbersApple < 1){
	appleX = Math.floor(Math.random()*(myCanvas.width/20))*20;
	appleY = Math.floor(Math.random()*(myCanvas.height/20))*20;	
	numbersApple += 1;
	}
	ctx.fillStyle = 'red';
	ctx.fillRect(appleX, appleY, 20, 20);	

	//console.log(appleX, snakeX)

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

setInterval(mainLoop, 100);