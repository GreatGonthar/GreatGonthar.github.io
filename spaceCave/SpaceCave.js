// начало проекта 11.04.20
let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
myCanvas.width = 1024;
myCanvas.height = 768;

const FPS = 60;
//let x = 0;
let xMax = 100;
let xMin = 20;
//let y = 0;
let yMax = 300;
let yMin = 20;
let a = 2 // коэффициен расстояния между верхом и низом (от 1 до 2)
let av = .01 // скорость сужения (уменьшения коэффициента)
let arrMountain = [];
let pics = 5; //количество пиков
let gravity = 1;
let arrBonus=[[1,1]];
let explosion = false;
let ship = {
	x: myCanvas.width / 2,
	y: myCanvas.height / 2,
	r: 20,
	death: 0,
	lives: 3,
	direction: {
		move: false,
		x: 0,
		y: 0,
	}
}


setInterval(mainLoop, 1000 / FPS); //TODO попробовать использовать setTimeout


createMountainsUP();
createMountainsDOWN();


function mainLoop() {
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);	

		ctx.lineWidth = 4;
		ctx.fillStyle = 'tan';
		ctx.strokeStyle = 'DarkGrey';

	ctx.fillRect(ship.x, ship.y, ship.r, ship.r);
	ctx.beginPath();
	//ctx.arc(ship.x, ship.y, ship.r, 0, 2*Math.PI, true);	
	ctx.closePath();
	ctx.fill();

		ctx.fillStyle = "PowderBlue";		
		ctx.font = "bold 20pt ubuntu";
		ctx.fillText(`расстояние сужается: ${a.toFixed(2)}`, 120, 50);
		ctx.fillText(`жизни: ${ship.lives}`, 120, 80);
		ctx.strokeStyle = 'DarkGrey';
		console.log(explosion)
		

	drawMountainsUP();
	drawMountainsDOWN();
	shipMove();
	CollisionMountainsUP();
	CollisionMountainsDOWN();
	CreateBonus();
	drawBonus();
	bonusCollision();
	GameOver();
	if (explosion == true){
		shipExplosion();
	}
}
function CreateBonus(){	
	let my_random = Math.floor(Math.random()*1000);
	//console.log(my_random);
		if (my_random == 4 && arrBonus[0][0] < 0){
			arrBonus.push([arrMountain[arrMountain.length-1][0], arrMountain[arrMountain.length-1][1]+ship.r*2]);
			arrBonus.shift();
		}		
}

function drawBonus(){	
	if (arrBonus != 0){
		ctx.beginPath();
		ctx.fillStyle = "GreenYellow";
		ctx.arc(arrBonus[0][0], arrBonus[0][1], ship.r/2, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.closePath();
		arrBonus[0][0] -= 1;	
			
	}	
}
function shipExplosion(){
		ctx.beginPath();
		ctx.fillStyle = "red";
		ctx.arc(ship.x+ship.r/2, ship.y+ship.r/2, ship.r, 0, 2*Math.PI, true);
		ctx.fill();
		ctx.closePath();
		ship.death +=1;
		ctx.fillText(`${Math.floor((600-ship.death)/100)}`, myCanvas.width/2, myCanvas.height/2);
		if (ship.death > 500){
			ship.death = 0;
			explosion = false;
			ship.lives--;
			ship.x = myCanvas.width/2;
			ship.y = yMax;
			}
}

function GameOver(){
	if (ship.lives < 0){
		alert("Начать снова");
		ship.lives = 3;
		a = 2;
		createMountainsUP();
		createMountainsDOWN();
	}
}

function bonusCollision(){
	let gipotenuza = Math.sqrt((ship.x - arrBonus[0][0])**2 + (ship.y - arrBonus[0][1])**2);
	console.log(gipotenuza);
	if (gipotenuza < ship.r){
		arrBonus[0][0] = -10;
		a += av*15;
		//explosion = true;
	}
}


function shipMove(){
	ship.x += ship.direction.x;
	if (ship.x <= 0){
		ship.x = 0;
		ship.direction.x = -ship.direction.x/2;
	}
	if (ship.x + ship.r >= myCanvas.width){
		ship.x = myCanvas.width - ship.r;
		ship.direction.x = -ship.direction.x/2;
	}
	if (ship.direction.move == true){					
		ship.y -= 8;
	}else {ship.y += gravity}	
}

function CollisionMountainsUP(){

	for (let i = 1; i < (arrMountain.length-1); i++){	

		// let lineShip1 = (ship.x-400)*(500-200); // пример коллизии
		// let lineShip2 = (100-400)*(ship.y-200);
		// let lineShip = lineShip1 - lineShip2;
		// (console.log(lineShip, lineShip1, lineShip2));
		// if (ship.x > 100 && ship.x < 400 && ship.y > 200 && ship.y < 500 ){
		// 	if (lineShip > 0 && lineShip < 1000){ship.y -= 1}				
		// 	if (lineShip < 0 && lineShip > -1000){ship.y += 1}				
		// }	

		let lineShip1 = (ship.x+ship.r-arrMountain[i-1][0])*(arrMountain[i][1]-arrMountain[i-1][1]); 
		let lineShip2 = ((arrMountain[i][0]-arrMountain[i-1][0]))*(ship.y-arrMountain[i-1][1]);
		let lineShip = lineShip1 - lineShip2;

		let lineShip1a = (ship.x-arrMountain[i-1][0])*(arrMountain[i][1]-arrMountain[i-1][1]); 
		let lineShip2a = ((arrMountain[i][0]-arrMountain[i-1][0]))*(ship.y-arrMountain[i-1][1]);
		let lineShipa = lineShip1a - lineShip2a;



		if (ship.x > arrMountain[i-1][0] && ship.x + ship.r < arrMountain[i][0]){ //делаем проверку на x отрезках
			if (lineShip > 0 || lineShipa > 0){   // все что выше линии, это плюс
				if (explosion == false){
					explosion = true;
				// ship.direction.x = -ship.direction.x*1.2; // отталкивание от поверхности
				// ship.y += 20;

				}else {
					ship.direction.x = 0;
					ship.x -=1; 
					ship.y = arrMountain[i][1];
				}	
			}
		}
	}
}

function CollisionMountainsDOWN(){

	for (let i = 1; i < (arrMountain2.length-1); i++){	
		let lineShip1 = (ship.x-arrMountain2[i-1][0])*(arrMountain2[i][1]-arrMountain2[i-1][1]); 
		let lineShip2 = (arrMountain2[i][0]-arrMountain2[i-1][0])*(ship.y + ship.r -arrMountain2[i-1][1]);
		let lineShip = lineShip1 - lineShip2;

		let lineShip1a = (ship.x + ship.r - arrMountain2[i-1][0])*(arrMountain2[i][1]-arrMountain2[i-1][1]); 
		let lineShip2a = (arrMountain2[i][0]-arrMountain2[i-1][0])*(ship.y + ship.r -arrMountain2[i-1][1]);
		let lineShipa = lineShip1a - lineShip2a;
		
		if (ship.x > arrMountain2[i-1][0] && ship.x + ship.r < arrMountain2[i][0]){ //делаем проверку на x отрезках
			if (lineShip < 0 || lineShipa < 0){ 
				if (explosion == false){

					explosion = true;
					// ship.direction.x = -ship.direction.x*1.2; // отталкивание от поверхности
					// ship.y -= 20;	
				} else {
					ship.direction.x = 0;
					ship.x -=1; 
					ship.y = arrMountain2[i][1];
				}				
				//ship.y = myCanvas.height/2;
				
			}			
		}

	}
}

function createMountainsUP(){
	let x = xMin*2; //сначала коридор прямой
	let y = yMin;
	arrMountain=[[x,y]];
	
	for (let i = 0; i < pics; i++){
		// let y = Math.random()*(yMax-yMin)+yMin;
		// let x = Math.random()*(xMax-xMin)+xMin;
		arrMountain.push([arrMountain[i][0] + x, y]);
	}
}
function createMountainsDOWN(){
	let x = xMin*2;
	let y = myCanvas.height-yMin;
	arrMountain2=[[x,y]];
	
	for (let i = 0; i < pics; i++){
		//let y = (Math.random()*(yMax-yMin)+yMin) + (yMax - yMin)*a;
		//let x = Math.random()*(xMax-xMin)+xMin;
		arrMountain2.push([arrMountain2[i][0] + x, y]);
	}
}

function drawMountainsUP(){
	ctx.beginPath();
	ctx.moveTo(arrMountain[0][0],arrMountain[0][1]);
	for (let i = 0; i < arrMountain.length; i++){
		ctx.lineTo(arrMountain[i][0], arrMountain[i][1]);
		ctx.stroke();
	}
	for (let i = 0; i < arrMountain.length; i++){
		arrMountain[i][0] -= 1;
	}	
	let y = Math.random()*(yMax-yMin)+yMin;
	let x = Math.random()*(xMax-xMin)+xMin;
	if (a < 0){y = yMax};
	if (arrMountain[arrMountain.length-1][0] <= myCanvas.width){		
		arrMountain.push([arrMountain[arrMountain.length-1][0] + x, y]);
	}

	if (arrMountain[0][0] <= -100){	
		arrMountain.shift();
		a -= av; // условие сужения туннеля				
	}

}

function drawMountainsDOWN(){	
	ctx.beginPath();
	ctx.moveTo(arrMountain2[0][0],arrMountain2[0][1]);
	for (let i = 0; i < arrMountain2.length; i++){
		ctx.lineTo(arrMountain2[i][0], arrMountain2[i][1]);
		ctx.stroke();
	}
	for (let i = 0; i < arrMountain2.length; i++){
		arrMountain2[i][0] -= 1;
	}	
	let y = (Math.random()*(myCanvas.height-yMax*a)+yMax*a);
	let x = Math.random()*(xMax-xMin)+xMin;
	if (a < 0){y = yMax};
	if (arrMountain2[arrMountain2.length-1][0] <= myCanvas.width){		
		arrMountain2.push([arrMountain2[arrMountain2.length-1][0] + x, y]);
	}

	if (arrMountain2[0][0] <= -100){	
		arrMountain2.shift();		
	}
	
}

function KeyDown(event) {
	if (explosion == false){
	switch(event.keyCode) {
		case 32:
			ship.direction.move = true;					
			break;
		case 37:	
			ship.direction.x -= 1;
			break;
		case 38:	
			//ship.y -= 1;
			break;
		case 39:
			ship.direction.x += 1;
			break;
		case 40:				
			break;
	}
}
}

function KeyUp(event) {
	switch(event.keyCode) {
		case 32:	
		ship.direction.move = false;	
			break;
		case 37:			
			break;
		case 38:	
			break;
		case 39:			
			break;
		case 40:
			
			break;	
	}
}

	document.addEventListener('keydown', KeyDown);
	document.addEventListener('keyup', KeyUp);


