import  assert  from 'assert';
import  Type  from '../type.mjs';
import  TypedFunction  from '../typed-function.mjs';

const me=()=>{
describe('TypedFunction', ()=>{
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

	it('create', ()=>{
		let func = TypedFunction(()=>(Float), (a, b)=>(a.value/b.value));
		assert.ok(func);
		assert.ok(func.type instanceof Function);
		assert.ok(func.value instanceof Function);
	});
	it('with new', ()=>{
		let func = new TypedFunction(()=>(Float), (a, b)=>(a.value/b.value));
		assert.ok(func);
		assert.ok(func.type instanceof Function);
		assert.ok(func.value instanceof Function);
	});
	it('with const returned type', ()=>{
		let func = new TypedFunction(Float, (a, b)=>(a.value/b.value));
		assert.ok(func);
		assert.ok(func.type instanceof Function);
		assert.ok(func.value instanceof Function);
		assert.ok(func.type().isEqual(Float));
	});
	describe('calculate', ()=>{
		let func = TypedFunction(()=>(Float), (a, b)=>(a.value/b.value));
		let a = Int.from(3), b = Int.from(2);
		it('type', ()=>{
			assert.ok(func.type(a, b).isEqual(Float));
		});
		it('value', ()=>{
			assert.equal(func.value(a, b), 3/2);
		});
		it('run', ()=>{
			let res = func(a, b);
			assert.equal(res.value, 3/2);
			assert.ok(res.type.isEqual(Float));
		});
	});
	describe('calculate type', ()=>{
		let func = TypedFunction((a, b)=>([a,b].every((a)=>(a.type.isImplements(Int))) ? Int : Float), (a, b)=>(a.value + b.value));
		it('int + int', ()=>{
			let value = func(Int.from(1), Int.from(2));
			assert.ok(value.type.isEqual(Int));
			assert.equal(value.value, 1+2);
		});
		it('int + float', ()=>{
			let value = func(Int.from(1), Float.from(2));
			assert.ok(value.type.isEqual(Float));
			assert.equal(value.value, 1+2);
		});
	});
});
};

import * as url from 'node:url';
import * as Path from 'node:path';

if (import.meta.url.startsWith('file:')) { // (A)
  const modulePath = url.fileURLToPath(import.meta.url);
  const mainPath = Path.join(process.cwd(), process.argv[2]);
  if (modulePath === mainPath) { // (B)
    me();
  }
}

export default me;