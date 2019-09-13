/**
 * Библиотека функций, помогающих оборачивать функции в TypedFunction,
 * и TypedFunction представляющих математические операторы JavaScript и унарные методы объекта Math
 */

const forval = (func)=>((...a)=>(func(...a.map(a=>a.value))));
const forval1 = (func)=>(a)=>(func(a.value));
const forval2 = (func)=>(a, b)=>(func(a.value, b.value));

const sameType = (a)=>(a.type);
const secondType = (_, b)=>(b.type);

const TypedFunction = require('./typed-function.js');


const withSameType = [
	['mod', (a, b)=>(a.value % b.value)],
	['add', (a, b)=>(a.value + b.value)],
	['sub', (a, b)=>(a.value - b.value)],
	['neg', (a)=>(-a.value)],
	['mul', (a, b)=>(a.value * b.value)],
	['div', (a, b)=>(a.value / b.value)],
	['pow', (a, b)=>(a.value ** b.value)]
].reduce((akk, [name, func])=>{
	akk[name] = TypedFunction(sameType, func);
	return akk;
}, {});

const math1 = (func)=>TypedFunction(sameType, forval1(func));

module.exports = {
	/**
	 * forval - функции, оборавичающие переданную функцию, таким образом, что на вход последней 
	 *	передаются значения свойства value от соответствуюзих аргументов функции-обёртки
	 * @function forval - для функций любого числа аргументов
	 * @function forval1 - для унарных функций
	 * @function forval2 - для бинарных функций
	 */
	forval,
	forval1,
	forval2,
	/**
	 * @function sameType - функция, возвращающая значение свойства type первого аргумента
	 */
	sameType,
	/**
	 * @function secondType - функция, возвращающая значение свойства type второго аргумента
	 */
	secondType,
	
	/**
	 * @function <(Function<(N), N>), TypedFunction> math1 - функция, оборачивающая унарную функцию, не изменяющую тип, в TypedFunction
	 */
	math1,
	
	...withSameType
	
};