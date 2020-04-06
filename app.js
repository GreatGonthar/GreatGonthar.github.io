let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
let appleX = 0;
let appleY = 300;
let snakeLongX = 20 * 6;
let snakeLongY = 20 * 6;

myCanvas.width = 800;
myCanvas.height = 600;
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
let alligmentX = 1;
let alligmentY = 0;

function drawPlayer(){
	ctx.fillStyle = 'red';
	ctx.fillRect(appleX, appleY, 20, 20);
	appleX += 20 * alligmentX;
	appleY += 20 * alligmentY;
	ctx.fillStyle = 'black';
	
	ctx.fillRect(appleX - (snakeLongX*alligmentX), appleY - (snakeLongY*alligmentY), 20, 20);


	(appleX > myCanvas.width) ? appleX = 0: true;
	(appleX < 0) ? appleX = myCanvas.width: true;
	(appleY > myCanvas.height) ? appleY = 0: true;
	(appleY < 0) ? appleY = myCanvas.height: true;
}

function keyMovePlayer(e){
	switch (e.keyCode) {
		case 37:
			console.log(e.keyCode);
			alligmentX = -1;
			alligmentY = 0;			
			break;
		case 38:
			console.log(e.keyCode);
			alligmentY = -1;
			alligmentX = 0;		
			break;	
		case 39:
			console.log(e.keyCode);
			alligmentX = 1;
			alligmentY = 0;			
			break;
		case 40:
			console.log(e.keyCode);
			alligmentY = 1;
			alligmentX = 0;		
			break;	
	}	
	//drawPlayer();		
}
addEventListener("keydown", keyMovePlayer);

setInterval(drawPlayer, 100);