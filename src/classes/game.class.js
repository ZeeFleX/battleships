import _ from 'underscore'
import Vue from 'vue'
import Player from '@/classes/player.class'
import Ship from '@/classes/ship.class'
import AI from '@/classes/ai.class'

export default class Game {
	constructor(){
		this.settings = {	//Опции
			fieldSizeX: 10, //Размер поля
			fieldSizeY: 10,
			shipsCount: {	//Количество кораблей
				battleship: 1,
				cruiser: 2,
				destroyer: 3,
				submarine: 4
			}
		}
		this.ships = [];
		this.players = [];
		this.logs = [];
		this.turnPlayerKey = 0;	//Ключ игрока, чей ход
		this.status = 'begin';	//Статус игры (begin/game/end)
	}

	//Функция старта новой игры. Обнуляем входные переменные
	startGame(name){
		this.status = 'game';
		this.ships = [];
		this.logs = [];
		//2 игрока, человек и AI
		this.players = [
			new Player({
				id: 0,
				name: name,
				ai: false,
			}),
			new Player({
				id: 1,
				name: 'Морской волк',
				ai: true,
				enemy: true
			})
		];
		let self = this;

		//Генерируем поле для каждого игрока, строим корабли
		_.each(this.players, function(player){
			self.generateField(player);
			_.each(self.settings.shipsCount, function(count, type){
				for (var i = 0; i < count; i++) {
					let ship = new Ship(type);
					player.ships.push(ship);
					player.shipsLeft = player.shipsLeft + ship.size;
				}

			});

			_.each(player.ships, function(ship, key){
				self.searchPlace(ship, player, function(ship){
					self.placeShip(ship, player);
				});
			});
			
		});

		self.turnPlayerKey = 0;
	}	

	//Выстрел
	fire(y,x, player, enemy){
		if(this.status === 'game' && enemy){
			if ( player.fieldState[y][x].indexOf('fired') === -1  ) {
				Vue.set(player.fieldState[y], [x], player.fieldState[y][x] + ' fired');
				let result;
				if(player.fieldState[y][x].indexOf('ship') !== -1){
					result = 'Попал!';
				}else{
					result = 'Мимо!';
				}
				this.logs.push(this.players[this.turnPlayerKey].name + ': Огонь (' + x + ',' + y + ') ' + result);
				this.checkPlayerState(this.players);
				this.nextPlayer();
			}else{
				return false;
			}
		}else{
			return false
		}
	}

	//Ход следующего игрока
	nextPlayer(){
		let self = this;
		if ( self.turnPlayerKey < self.players.length - 1) {
			self.turnPlayerKey++;
		}else{
			self.turnPlayerKey = 0;
		}
		
		if( self.players[self.turnPlayerKey].ai ){
			let ai = new AI;

			_.each(self.players, function(player, key){
				if( !player.ai ){
					let coords = ai.aim( player.fieldState );
					if( coords ){
						self.fire(coords.y, coords.x, player, true);
					} else{
						self.status = 'end';
					}	
				}
			});
		}else{

		}
	}

	//Проверка состояния полей игроков
	checkPlayerState(players){
		let self = this;
		_.each(players, function(player, key){
			let shipsLeft = 0;
			_.each(player.fieldState, function(row, y){
				_.each(row, function(col, x){
					if(player.fieldState[y][x] === 'ship' && player.fieldState[y][x] !== 'fired') shipsLeft++;
				});
			});
			player.shipsLeft = shipsLeft;
			if( !shipsLeft ) {
				self.endGame(player);
			}
		});
	}

	//Конец игры, вывод в лог
	endGame(player){
		if (this.status !== 'end') this.logs.push('Игра окончена, у ' + player.name + ' не осталось кораблей.');
		this.status = 'end';
	}

	//Поиск подхоящего места для корабля
	searchPlace(ship, player, callback){
		let self = this;
		ship.coords[0] = {
			x: _.random(0, this.settings.fieldSizeX - 1),
			y: _.random(0, this.settings.fieldSizeY - 1)
		};

		ship = this.buildShip(ship);

		this.checkPlacement(ship, player.fieldState);

		if(ship.readyToPlace){
			callback(ship);
		}else{
			self.rotateShip(ship);
			self.searchPlace(ship, player, callback);
		}
	
	}

	//Создание объекта корабля
	buildShip(ship){
		switch(ship.direction){
			case "up":
				if( ship.coords[0].y - ( ship.size - 1 ) < 0 ) Vue.set( ship.coords, 0, {y: ship.size - 1, x: ship.coords[0].x} );
				for (var s = 0; s < ship.size; s++) {
					Vue.set(ship.coords, s, { x: ship.coords[0].x, y: ship.coords[0].y - s });
				}
			break;
			case "right":
				if( ship.coords[0].x + ( ship.size - 1 ) > this.settings.fieldSizeX - 1 ) Vue.set( ship.coords, 0, {y: ship.coords[0].y, x: this.settings.fieldSizeX - ship.size} );
				for (var s = 0; s < ship.size; s++) {
					Vue.set(ship.coords, s, { x: ship.coords[0].x + s, y: ship.coords[0].y });
				}
			break;
			case "down":
				if( ship.coords[0].y + ( ship.size - 1 ) > this.settings.fieldSizeY - 1 ) Vue.set( ship.coords, 0, {y: this.settings.fieldSizeY - ship.size, x: ship.coords[0].x} );
				for (var s = 0; s < ship.size; s++) {
					Vue.set(ship.coords, s, { x: ship.coords[0].x, y: ship.coords[0].y + s });
				}
			break;
			case "left":
				if( ship.coords[0].x - ( ship.size - 1 ) < 0 ) Vue.set( ship.coords, 0, {y: ship.coords[0].y, x: ship.size - 1} );
				for (var s = 0; s < ship.size; s++) {
					Vue.set(ship.coords, s, { x: ship.coords[0].x - s, y: ship.coords[0].y });
				}
			break;
		}
		return ship;
	}

	//Поворот корабля
	rotateShip(ship){
		switch(ship.direction){
			case "up":
				ship.direction = 'right';
			break;
			case "right":
				ship.direction = 'down';
			break;
			case "down":
				ship.direction = 'left';
			break;
			case "left":
				ship.direction = 'up';
			break;
		}
		this.buildShip(ship);
	}

	//Проверка размещения корабля
	checkPlacement(ship, fieldState){
		ship.readyToPlace = true;
		for (var n = 0; n < ship.coords.length; n++) {
			let x = ship.coords[n].x,
				y = ship.coords[n].y;
			if(x > this.settings.fieldSizeX || y > this.settings.fieldSizeY || fieldState[y][x] !== 'sea') ship.readyToPlace = false; 
		}
	}

	//Генерация поля для игрока
	generateField(player){	
		for (var y = this.settings.fieldSizeY - 1; y >= 0; y--) {
			Vue.set(player.fieldState, y, []);
			for (var x = this.settings.fieldSizeX - 1; x >= 0; x--) {
				Vue.set(player.fieldState[y], x, 'sea');
			}
		}
	}

	//Размещение корабля на поле
	placeShip(ship, player){
		for (var c = 0; c < ship.coords.length; c++) {
			Vue.set(player.fieldState[ship.coords[c].y], [ship.coords[c].x], 'ship');
		}	
		this.setSpaceMargin(player);
	}

	//Установка отступов от кораблей
	setSpaceMargin(player){
		let marginArray = ['ship'];
		for (var y = player.fieldState.length - 1; y >= 0; y--) {
			for (var x = player.fieldState[y].length - 1; x >= 0; x--) {
				if( player.fieldState[y][x] === 'ship') {
					if( y-1 >= 0 && player.fieldState[y-1][x].indexOf(marginArray) === -1 ) Vue.set(player.fieldState[y-1], x, 'margin');
					if( y+1 <= this.settings.fieldSizeY - 1 && player.fieldState[y+1][x].indexOf(marginArray) === -1 ) Vue.set(player.fieldState[y+1], x, 'margin');
					if( x+1 <= this.settings.fieldSizeX - 1 && player.fieldState[y][x+1].indexOf(marginArray) === -1 ) Vue.set(player.fieldState[y], x+1, 'margin');
					if( x-1 >= 0 && player.fieldState[y][x-1].indexOf(marginArray) === -1) Vue.set(player.fieldState[y], x-1, 'margin');
					if( y+1 <= this.settings.fieldSizeY - 1 && x+1 <= this.settings.fieldSizeX - 1 && player.fieldState[y+1][x+1].indexOf(marginArray) === -1 ) Vue.set(player.fieldState[y+1], x+1, 'margin');
					if( y-1 >= 0 && x-1 >= 0 && player.fieldState[y-1][x-1].indexOf(marginArray) === -1) Vue.set(player.fieldState[y-1], x-1, 'margin');
					if( y+1 <= this.settings.fieldSizeY - 1 && x-1 >= 0 && player.fieldState[y+1][x-1].indexOf(marginArray) === -1 ) Vue.set(player.fieldState[y+1], x-1, 'margin');
					if( y-1 >= 0 && x+1 <= this.settings.fieldSizeX - 1 && player.fieldState[y-1][x+1].indexOf(marginArray) === -1) Vue.set(player.fieldState[y-1], x+1, 'margin');
				}
			}
		}
	}
}