import _ from 'underscore'

export default class AI{
	//Случайный выстрел AI
	aim(targetFieldState){
		var posibleCoords = [];

		_.each(targetFieldState, function(row, y){
			_.each(row, function(col, x){
				if(targetFieldState[y][x].indexOf('fired') === -1) posibleCoords.push(y + '-' + x);
			});
		});

		if( posibleCoords.length ){
			let coords = posibleCoords[_.random(0, posibleCoords.length - 1)].split('-');
			return { y: coords[0], x: coords[1] }
		}else{
			return false
		}
	}
}