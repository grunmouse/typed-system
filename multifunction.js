const TypedFunction = require('./typed-function.js');

const Type = require('./type.js');

class SpecMap{
	constructor(){
		this._map = new Map();
	}
	/**
	 * @method add - добавляет реализацию функции
	 * @param {Array<Type>} types - спецификация принимаемых аргументов
	 * @param {TypedFunction} func - реализация функции для этого набора аргументов
	 */
	add(types, func){
		let count = types.length;
		if(!this._map.has(count)){
			this._map.set(count, new Map());
		}
		let map = this._map.get(count);
		map.set(types, func);
	}
	
	/**
	 * @method get - возвращает реализацию функции по набору аргументов
	 * @param {Array<Type>} types - спецификация принимаемых аргументов
	 * @returned {TypedFunction} - реализация функции для этого набора аргументов
	 *
	 */
	get(types){
		let count = types.length;
		let map = this._map.get(count);
		if(!map) return;
		
		for(let [face, func] of map){
			//Могут быть проблемы с порядком поиска
			if(Type.paramImplements(types, face)){
				return func;
			}
		}
	}
}


/**
 * @class Multifunction
 * Представляет мультифункцию extends Function
 *
 * @method add - добавляет реализацию функции
 * @param {Array<Type>} types - спецификация принимаемых аргументов
 * @param {TypedFunction|[type, value]} func - реализация функции для этого набора аргументов
 *
 * @method get - возвращает реализацию функции по набору аргументов
 * @param {Array<Type>} types - спецификация принимаемых аргументов
 * @returned {TypedFunction} - реализация функции для этого набора аргументов
 *
 * @callable
 * @params {...Array<TypedValue>} - аргументы мультифункции
 * @returned {TypedValue} - результат вызванной TypedFunction
 * @throws {TypeError} - если функция не найдена
 */
function Multifunction(){
	const map = new SpecMap();
	const run = function(...arg){
		let types = arg.map(a=>a.type);
		let func = map.get(types);
		if(!func){
			throw new TypeError('Match not found: invalid arguments list');
		}
		return func.apply(this, arg);
	}
	
	run.add = function(types, func){
		if(Array.isArray(func)){
			func = TypedFunction(...func);
		}
		if(types instanceof Type){
			types = [types];
		}
		map.add(types, func);
	};
	
	run.get = function(types){
		return map.get(types);
	}
	
	return run;
}

module.exports = Multifunction;