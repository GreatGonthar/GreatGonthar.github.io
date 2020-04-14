// начало проекта 11.04.20
let myCanvas = document.getElementById("my_canvas");
let ctx = myCanvas.getContext("2d");
myCanvas.width = 1024;
myCanvas.height = 768;

const shipSize = 10; //диаметр корабля
const FPS = 20;
const numberRoids = 20; // количество астероидов
const sizeRoids = 500; // размер астероида
const vertRoids = sizeRoids/60; // максимальное количество граней
const blob = sizeRoids/3000; // коэффициент корявости от 0 до 1 
let blobs = []; // массив хранящий коэффициент выпуклости каждой грани
let roids = []; // массив для хранения созданных астероидов со всеми параметрами

let ship = {
	x: myCanvas.width / 2,
	y: myCanvas.height / 2,
	r: shipSize,
	a: Math.PI,
	speed: 0,
	rotation: 0,
	direction: {
		directionMove: false,
		x: 0,
		y: 0,
	}
}

createAsteroids();

setInterval(mainLoop, 1000 / FPS);

function mainLoop() {	
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);	
	
	// рисуем корабль
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 2;
	ctx.beginPath();
	//ctx.arc(ship.x, ship.y, ship.r, 0, ship.a*2, true);
	ctx.moveTo(
		ship.x - Math.cos(ship.rotation*(ship.a/180))*ship.r,
		ship.y - Math.sin(ship.rotation*(ship.a/180))*ship.r
		);
	ctx.lineTo(
		ship.x - Math.cos((ship.rotation+120)*(ship.a/180))*ship.r,
		ship.y - Math.sin((ship.rotation+120)*(ship.a/180))*ship.r
		);
	 ctx.lineTo(
		ship.x - Math.cos((ship.rotation+240)*(ship.a/180))*ship.r,
		ship.y - Math.sin((ship.rotation+240)*(ship.a/180))*ship.r
		);
	ctx.closePath();
	ctx.stroke();	
	ctx.clearRect(
		ship.x - ship.r / 5 / 2 - Math.cos(ship.rotation*(ship.a/180))*ship.r/2,
		ship.y - ship.r / 5 / 2 - Math.sin(ship.rotation*(ship.a/180))*ship.r/2,
		ship.r / 5, ship.r / 5);

	// рисуем огонь
	if (ship.direction.directionMove){
		ctx.strokeStyle = 'yellow';
		ctx.lineWidth = 4;
		ctx.fillStyle = "red";
		ctx.beginPath();
		//ctx.arc(ship.x, ship.y, ship.r, 0, ship.a*2, true);
		ctx.moveTo(
			ship.x + Math.cos((ship.rotation)*(ship.a/180))*ship.r*2,
			ship.y + Math.sin((ship.rotation)*(ship.a/180))*ship.r*2
			);
		ctx.lineTo(
			ship.x - Math.cos((ship.rotation+160)*(ship.a/180))*ship.r,
			ship.y - Math.sin((ship.rotation+160)*(ship.a/180))*ship.r
			);
		 ctx.lineTo(
			ship.x - Math.cos((ship.rotation+200)*(ship.a/180))*ship.r,
			ship.y - Math.sin((ship.rotation+200)*(ship.a/180))*ship.r
			);
		ctx.closePath();
		ctx.stroke();	
		ctx.fill();
	}	

	ship.rotation += ship.speed // поворот корабля с определенной скоростью

	if (ship.x > myCanvas.width){ship.x = 0;} //выход за границы экрана
	if (ship.y > myCanvas.height){ship.y = 0;}
	if (ship.x < 0){ship.x = myCanvas.width;}
	if (ship.y < 0){ship.y = myCanvas.height;}

		ship.x -= ship.direction.x;	//движение корабля
		ship.y -= ship.direction.y;
	if (ship.direction.directionMove){
		ship.x -= Math.cos(ship.rotation*(ship.a/180));	
		ship.y -= Math.sin(ship.rotation*(ship.a/180));
	}
	
	// рисуем астероид
	ctx.strokeStyle = 'grey';
	ctx.lineWidth = 2;
	let x, y, r, a, vert;
	for (let i = 0; i < roids.length; i++) { // создаем нужное количество астероидов
		x = roids[i].x; // присваиваем переменным параметры астероида (для удобного их использования)
		y = roids[i].y;
		r = roids[i].r;
		a = roids[i].a;
		b = roids[i].b;
		vert = roids[i].vert;
		ctx.beginPath();
		ctx.moveTo(
			x + r * b[0] * Math.cos(a),
			y + r * b[0] * Math.sin(a)
			);

		for (let j = 0; j < vert; j++) {	

			ctx.lineTo(						
				x + r * b[j+1]* Math.cos(a + j * Math.PI * 2 / vert),
				y + r * b[j+1]* Math.sin(a + j * Math.PI * 2 / vert)
			);
		}
		ctx.closePath();
		ctx.stroke();		

		roids[i].x += roids[i].xv; // движение астероидов
		roids[i].y += roids[i].yv;
		if (roids[i].x > myCanvas.width){roids[i].x = 0;} //выход за границы экрана
		if (roids[i].y > myCanvas.height){roids[i].y = 0;}
		if (roids[i].x < 0){roids[i].x = myCanvas.width;}
		if (roids[i].y < 0){roids[i].y = myCanvas.height;}
	}
}

function createAsteroids() {
	roids = []; //обнуляем массив колличества астероидов

	let x, y;
	for (let i = 0; i < numberRoids; i++) { // создаем координаты всех астероидов		
		do {
			x = Math.floor(Math.random() * myCanvas.width);
			y = Math.floor(Math.random() * myCanvas.height);			
		} while ((Math.sqrt((ship.x - x)**2 + (ship.y - y)**2)) < sizeRoids/2); //только если их центр находится от центра корабля на расстоянии
			blobs = []; // обнуляем массив корявости
			for (let j = 0; j < vertRoids; j++) { // загружаем в массив данные о выпуклостях
			blobs.push(Math.random() * blob + .1);
			}
		roids.push(newAsteroid(x, y, blobs)) // загружаем астероиды в массив с созданными координатами

	}
}

function newAsteroid(x, y, b) {
	let roid = { // объект содержащий все параметры астероида
		x: x,
		y: y,
		xv: Math.random()*3*(Math.random() < 0.5 ? 1 : -1),
		yv: Math.random()*3*(Math.random() < 0.5 ? 1 : -1),
		r: Math.random()*sizeRoids,
		a: Math.random()* Math.PI * 2,
		vert: vertRoids,
		b: b,
	}
	return roid;
}




function KeyDown(event) {
	switch(event.keyCode) {
		case 37:
			ship.speed = -FPS/1.5;
			break;
		case 38:
			ship.direction.directionMove = true;		
			ship.direction.x += Math.cos(ship.rotation*(ship.a/180));
			ship.direction.y += Math.sin(ship.rotation*(ship.a/180));			
			break;
		case 39:
			ship.speed = FPS/1.5;
			break;
		case 40:
			break;
	}
}

function KeyUp(event) {
	switch(event.keyCode) {
		case 37:
			ship.speed = 0;
			break;
		case 38:
			ship.direction.directionMove = false;
			break;
		case 39:
			ship.speed = 0;
			break;
	}
}

document.addEventListener('keydown', KeyDown);
document.addEventListener('keyup', KeyUp);
