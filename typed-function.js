const Type = require('./type.js');

/**
 * @class TypedFunction
 * Представляет функцию, принимающую и возвращающую типизированные значения (TypedValue); extends Function
 *
 * @constructor TypedFunction(type, value)
 * @param {Function|Type} type - функция, вычисляющая тип возвращаемого TypedValue
 * @param {Function} value - функция, вычисляющая значение возвращаемого TypedValue
 *
 * @callable
 * @params {...Array<TypedValue>} - аргументы
 * @returned {TypedValue}
 */
function TypedFunction(type, value){
	let me, _type;
	if(type instanceof Type){
		me = function(...args){
			return type.from(value(...args));
		};
		me.type = ()=>(type);
	}
	else{
		me = function(...args){
			return type(...args).from(value(...args));
		};
		me.type = type;
	}
	me.value = value;

	return me;
}

module.exports = TypedFunction;