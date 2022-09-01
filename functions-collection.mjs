import  Multifunction  from './multifunction.mjs';

/**
 * @class FunctionsCollection
 * Представляет набор мультифункций со строковами ключами.
 * Предоставляет интерфейс для добавление и вызова реализаций мультифункций по имени и спецификации.
 *
 * @method get - возвращает мультифункцию мо имени
 * @param {string} name - имя
 * @param {boolean} [toThrow=false] - бросить ошибку, если функция не найдена
 * @returned {Multifunction} - мультифункция из набора
 * @throws {ReferenceError} - функция не найдена
 *
 * @method add - добавляет реализацию мультифункции
 * @param {string} name - имя мультифункции
 * @param {Array<Type>} spec - спецификация принимаемых аргументов
 * @param {TypedFunction|[type, value]} func - реализация функции для этого набора аргументов
 *
 *
 * @method call - вызывает реализацию мультифункции
 * @param {string} name - имя мультифункции
 * @param {Array<TypedValue>} args - передаваемые ей вычисления
 * @returned {TypedValue} - результат вычисления
 * @throws {ReferenceError} - функция не найдена
 * @throws {TypeError} - аргументы не соответствуют ни одной спецификации функции
 */
class FunctionsCollection{
	/**
	 * @constructor
	 * @param {Iterable<[name, spec, func]>} - массив массивов, каждый из которых будет подан на вход add в роли параметров
	 */
	constructor(config){
		this.map = new Map();
		if(config) for(let item of config){
			this.add(...item);
		}
	}
	
	keys(){
		return this.map.keys();
	}
	
	get(name, toThrow){
		let func = this.map.get(name);
		if(!func && toThrow){
			throw new ReferenceError('Not exists a function "'+name+'"');
		}
		return func;
	}
	
	add(name, spec, func){
		if(!this.map.has(name)){
			this.map.set(name, Multifunction());
		}
		let fun = this.map.get(name);
		fun.add(spec, func);
	}
	
	call(name, args){
		let func = this.map.get(name);
		if(!func){
			throw new ReferenceError('Not exists a function "'+name+'"');
		}
		return func.apply(this, args);
	}
	
	/**
	 *
	 * @returned {Function<(ClosingBehaviour), (OperatorEval)>}
	 */
	createFactory(config){
		let factory;
		if(Array.isArray(config)){
			let map = new Map(config.map(([bracket, key])=>([bracket, this.get(key)])));
			factory = (closing)=>(map.get(closing.bracket));
			factory.kit = [...map.values()];
		}
		else if(typeof config === 'string'){
			let func = this.get(config);
			if(func){
				factory = ()=>(func);
				factory.kit = [func];
			}
		}
		return factory;
	}
}

export default  FunctionsCollection;