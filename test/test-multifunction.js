const assert = require('assert');
const Type = require('../type.js');
const TypedFunction = require('../typed-function.js');
const Multifunction = require('../multifunction.js');

describe('Multifunction', ()=>{
	it('create', ()=>{
		let func = Multifunction();
		assert.ok(func instanceof Function);
		assert.ok(func.add instanceof Function);
		assert.ok(func.get instanceof Function);
	});
	it('with new', ()=>{
		let func = new Multifunction();
		assert.ok(func instanceof Function);
		assert.ok(func.add instanceof Function);
		assert.ok(func.get instanceof Function);
	});
	
	const Number = new Type({name:'Number', isAbstract:true});
	const Int = new Type({
		name:'Integer',
		faces:[Number],
		parse(str){
			return parseInt(str);
		},
		stringify(value){
			return ""+value;
		}
	});
	const Float = new Type({
		name:'Float',
		faces:[Number],
		parse(str){
			return parseFloat(str);
		},
		stringify(value){
			return ""+value;
		}
	});
	const Byte = new Type({
		name:'Byte',
		faces:[Int],
		parse(str){
			return parseInt(str);
		},
		stringify(value){
			return ""+value;
		}
	});	
	
	const Vector = new Type({
		name:'Vector',
		isAbstract:true,
		specify(N){
			return new Type({
				template:this,
				faces:[this],
				params:[N],
				create(...arr){
					return arr.slice(0,N);
				},
				stringify(val){
					return '{' + val.join('; ') + '}';
				}
			});
		}
	});
	
	describe('add realisation', ()=>{
		let func = Multifunction();
		
		let int_int = TypedFunction(()=>(Int), (a, b)=>(a-b));
		let number_number = TypedFunction(()=>(Float), (a, b)=>(a-b));
		let number = TypedFunction((a)=>(a.type), (a)=>(-a.value));
		
		func.add([Int, Int], int_int);
		func.add([Number, Float], number_number);
		func.add([Float, Number], number_number);
		func.add([Number], number);
		
		it('exist added functions', ()=>{
			assert.equal(func.get([Number]), number);
			assert.equal(func.get([Number, Float]), number_number);
			assert.equal(func.get([Float, Number]), number_number);
			assert.equal(func.get([Int, Int]), int_int);
		});
		it('find function with types', ()=>{
			assert.equal(func.get([Int]), number);
			assert.equal(func.get([Int, Float]), number_number);
			assert.equal(func.get([Float, Int]), number_number);
			assert.equal(func.get([Float, Float]), number_number);
			assert.equal(func.get([Int, Byte]), int_int);
		});
	});
	
	describe('add as [type, func]', ()=>{
		let func = Multifunction();
		
		func.add([Number, Number], [()=>(Float), (a, b)=>(a-b)]);
		func.add([Number], [(a)=>(a.type), (a)=>(-a.value)]);
		
		it('exist added functions', ()=>{
			assert.ok(func.get([Number]).type instanceof Function);
			assert.ok(func.get([Number, Number]).type instanceof Function);
		});
		
	});
	
	
	
	describe('call', ()=>{
		let func = Multifunction();
		let number = TypedFunction(()=>(Float), (a, b)=>(a.value+b.value));
		let vector = TypedFunction(
			(...arr)=>(Vector.specify(Math.max(...arr.map((a)=>(a.type.params[0]))))), 
			(...arr)=>{
				let vals = arr.map((a)=>(a.value));
				let len = Math.max(...arr.map(a=>(a.type.params[0])));
				let result = [];
				for(let i=0; i<len; ++i){
					result[i] = vals[0][i] + vals[1][i];
				}
				return result;
			}
		);
		func.add([Number, Number], number);
		func.add([Vector, Vector], vector);
		it('exist functions', ()=>{
			assert.ok(func.get([Vector, Vector]), vector);
			assert.ok(func.get([Vector.specify(3), Vector.specify(3)]), vector);
		});
		it('sum number', ()=>{
			let res = func(Float.from(1), Float.from(2));
			assert.ok(res.type.isEqual(Float));
			assert.equal(res.value, 3);
		});
		it('sum vector<3>', ()=>{
			let res = func(Vector.specify(3).from([1, 2, 3]), Vector.specify(3).from([4,5,6]));
			assert.ok(res.type.isEqual(Vector.specify(3)));
			assert.deepEqual(res.value, [5,7,9]);
		});
	});
});