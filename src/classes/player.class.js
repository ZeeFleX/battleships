export default class Player{
	constructor(options){
		this.id = options.id; 
		this.name = options.name;
		this.ai = options.ai;
		this.fieldState = [];	//Состояние поля игрока
		this.ships = [];		//Корабли игрока
		this.enemy = options.enemy;	//Является ли целью
		this.shipsLeft = 0;	//Остаток кораблей на поле
	}
}