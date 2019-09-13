const assert = require('assert');
const Type = require('../type.js');
const TypedFunction = require('../typed-function.js');
const FunctionsCollection = require('../functions-collection.js');

describe('FunctionsCollection', ()=>{
	const NumberType = new Type({
		name:'Number',
		parse(str){
			let val = +str;
			if(isNaN(val)){
				throw new SyntaxError('Can not parse string as Number');
			}
		},
		stringify(val){
			return "" + val;
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
	describe('create', ()=>{
		it('empty', ()=>{
			let scope = new FunctionsCollection();
			assert.ok(scope);
			assert.ok(scope.get);
			assert.ok(scope.add);
			assert.ok(scope.call);
		});
		describe('with config', ()=>{
			let vectorSum = TypedFunction(
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
			let vectorMulConst = TypedFunction(()=>(Vector), (a,b)=>{
				if(a.type.isImplements(NumberType)){
					[a, b] = [b, a];
				}
				return a.value.map((a)=>(a*b.value));
			});
			let config = [
				['+', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value+b.value)]],
				['+', [Vector, Vector], vectorSum],
				['*', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value*b.value)]],
				['*', [Vector, Vector], [()=>(NumberType), (a,b)=>{
					return a.value.reduce((akk, a, i)=>(akk+a*b.value[i]), 0);
				}]],
				['*', [Vector, NumberType], vectorMulConst],
				['*', [NumberType, Vector], vectorMulConst]
			];
			let scope = new FunctionsCollection(config);
			it('instanse', ()=>{
				assert.ok(scope);
				assert.ok(scope.get);
				assert.ok(scope.add);
				assert.ok(scope.call);
			});
			it('+', ()=>{
				let mf = scope.get('+');
				assert.ok(mf.get([NumberType, NumberType]) instanceof Function);
				assert.ok(mf.get([Vector, Vector]) instanceof Function);
			});
			it('*', ()=>{
				let mf = scope.get('*');
				assert.ok(mf.get([NumberType, NumberType]) instanceof Function);
				assert.ok(mf.get([Vector, Vector]) instanceof Function);
			});
			it('keys', ()=>{
				let actual = [...scope.keys()].sort();
				let required = ['+', '*'].sort();
				assert.deepEqual(actual, required);
			});
			
		});
	});
	describe('adding', ()=>{
		let vectorSum = TypedFunction(
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
		let vectorMulConst = TypedFunction(()=>(Vector), (a,b)=>{
			if(a.type.isImplements(NumberType)){
				[a, b] = [b, a];
			}
			return a.value.map((a)=>(a*b.value));
		});
		let scope = new FunctionsCollection();
		scope.add('+', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value+b.value)]);
		scope.add('+', [Vector, Vector], vectorSum);
		scope.add('*', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value*b.value)]);
		scope.add('*', [Vector, Vector], [()=>(NumberType), (a,b)=>{
			return a.value.reduce((akk, a, i)=>(akk+a*b.value[i]), 0);
		}]);
		scope.add('*', [Vector, NumberType], vectorMulConst);
		scope.add('*', [NumberType, Vector], vectorMulConst);
		it('+', ()=>{
			let mf = scope.get('+');
			assert.ok(mf.get([NumberType, NumberType]) instanceof Function);
			assert.ok(mf.get([Vector, Vector]) instanceof Function);
		});
		it('*', ()=>{
			let mf = scope.get('*');
			assert.ok(mf.get([NumberType, NumberType]) instanceof Function);
			assert.ok(mf.get([Vector, Vector]) instanceof Function);
		});
		it('- is not exists', ()=>{
			assert.throws(()=>(scope.get('-', true)), ReferenceError, 'Not exists a function "-"');
			assert.doesNotThrow(()=>(scope.get('-')), ReferenceError, 'Not exists a function "-"');
		});
	});
	describe('call', ()=>{
		let vectorSum = TypedFunction(
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
		let vectorMulConst = TypedFunction(()=>(Vector), (a,b)=>{
			if(a.type.isImplements(NumberType)){
				[a, b] = [b, a];
			}
			return a.value.map((a)=>(a*b.value));
		});
		let config = [
			['+', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value+b.value)]],
			['+', [Vector, Vector], vectorSum],
			['*', [NumberType, NumberType], [()=>(NumberType), (a,b)=>(a.value*b.value)]],
			['*', [Vector, Vector], [()=>(NumberType), (a,b)=>{
				return a.value.reduce((akk, a, i)=>(akk+a*b.value[i]), 0);
			}]],
			['*', [Vector, NumberType], vectorMulConst],
			['*', [NumberType, Vector], vectorMulConst]
		];
		let scope = new FunctionsCollection(config);
		
		it('vector<2> + vector<2>', ()=>{
			let a = scope.call('+', [Vector.specify(2).from([0,1]), Vector.specify(2).from([1,0])]);
			assert.ok(a.type.isEqual(Vector.specify(2)));
			assert.deepEqual(a.value, [1,1]);
		});
		it('number + number', ()=>{
			let a = scope.call('+', [NumberType.from(1), NumberType.from(2)]);
			assert.ok(a.type.isEqual(NumberType));
			assert.equal(a.value, 3);
		});
		it('number + vector<2>', ()=>{
			assert.throws(
				()=>{
					let a = scope.call('+', [NumberType.from(1), Vector.specify(2).from([1,0])]);
				}, 
				TypeError, 'Match not found: invalid arguments list'
			);
		});
		
	});
	describe('createFactory', ()=>{
		
	});
});