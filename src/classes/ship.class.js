export default class Ship {
	constructor(type){
		this.size = 1; //Размер корабля
		this.coords = [ //Начальные коодинаты
			{
				x:0,
				y:0
			}
		];
		this.direction = 'right'; //Направление
		this.readyToPlace = true; //Готов ли к размещению
		this.status = 'active'; //Подбит или нет

		switch(type){
			case 'submarine': 
				this.name = 'Submarine';
				this.size = 1;
			break;
			case 'destroyer': 
				this.name = 'Destroyer';
				this.size = 2;
			break;
			case 'cruiser': 
				this.name = 'Cruiser';
				this.size = 3;
			break;
			case 'battleship': 
				this.name = 'Battleship';
				this.size = 4;
			break;
		}
	}
}