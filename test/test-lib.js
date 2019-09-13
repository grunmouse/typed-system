const lib = require('../lib.js');
const assert = require('assert');
const sinon = require('sinon');

const Type = require('../type.js');

function assertTyped(actual, required){
	if(required){
		assert.ok(actual, 'required');
		assert.ok(actual.type.isEqual(required.type), 'required type');
		assert.equal(actual.value, required.value, 'required value');
	}
	else{
		assert.ok(typeof actual === 'undefined', 'undefined');
	}
}

describe('typed functions library', ()=>{
	describe('basic', ()=>{
		it('exist library', ()=>{
			assert.ok(lib);
		});
		
		it('forval', ()=>{
			const func = sinon.stub();
			
			const wrapped = lib.forval(func);
			
			const val = Array.from({length: Math.floor(Math.random() * 40)}, () => Math.floor(Math.random() * 40));
			const args = val.map((value)=>({value}));

			wrapped(...args);
			
			assert.ok(func.lastCall.calledWith(...val));
			
		});
		it('forval2', ()=>{
			const func = sinon.stub();
			
			const wrapped = lib.forval2(func);
			
			const val = Array.from({length: 2}, () => Math.floor(Math.random() * 40));
			const args = val.map((value)=>({value}));

			wrapped(...args);
			
			assert.ok(func.lastCall.calledWith(...val));
			
		});	
		it('forval1', ()=>{
			const func = sinon.stub();
			
			const wrapped = lib.forval1(func);
			
			const val = Math.floor(Math.random() * 40);
			
			wrapped({value:val});
			
			assert.ok(func.lastCall.calledWith(val));
		});
		
		it('sameType', ()=>{
			const type = {};
			
			assert.equal(lib.sameType({type}), type);
		});
		it('secondType', ()=>{
			const type1 = {};
			const type2 = {};
			
			assert.equal(lib.secondType({type:type1}, {type:type2}), type2);
		});
	});

	describe('operators', ()=>{
		const MyType = new Type({
			name:'Number',
			create(a){
				return a;
			}, 
			stringify(a){return ''+a}
		});
		it('mod', ()=>{
			const a = MyType.from(Math.floor(Math.random()*100)); 
			const b = MyType.from(Math.floor(Math.random()*100)); 
			let c = lib.mod(a, b); 
			assertTyped(c, MyType.from(a % b));
		});
		it('add', ()=>{
			const a = MyType.from(Math.random()*100); 
			const b = MyType.from(Math.random()*100); 
			let c = lib.add(a, b); 
			assertTyped(c, MyType.from(a+b));
		});
		it('sub', ()=>{
			const a = MyType.from(Math.random()*100); 
			const b = MyType.from(Math.random()*100); 
			let c = lib.sub(a, b); 
			assertTyped(c, MyType.from(a-b));
		});
		it('mul', ()=>{
			const a = MyType.from(Math.random()*100); 
			const b = MyType.from(Math.random()*100); 
			let c = lib.mul(a, b); 
			assertTyped(c, MyType.from(a*b));
		});
		it('div', ()=>{
			const a = MyType.from(Math.random()*100); 
			const b = MyType.from(Math.random()*100); 
			let c = lib.div(a, b); 
			assertTyped(c, MyType.from(a/b));
		});
		it('pow', ()=>{
			const a = MyType.from(Math.random()*100); 
			const b = MyType.from(Math.random()*10); 
			let c = lib.pow(a, b); 
			assertTyped(c, MyType.from(a ** b));
		});
		it('neg', ()=>{
			const a = MyType.from(Math.random()*100); 
			let c = lib.neg(a); 
			assertTyped(c, MyType.from(-a));
		});
	});




	
});