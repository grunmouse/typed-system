
import assert from 'assert';
import Type from '../type.mjs';

const me = ()=>{
describe('Type', ()=>{

	it('class exist', ()=>{
		assert.ok(Type);
	});
	it('create instance named abstract', ()=>{
		const MyType = new Type({name:'MyType', isAbstract:true});
		assert.ok(MyType instanceof Type);
		assert.equal(MyType.isAbstract, true);
		assert.equal(MyType.name, 'MyType');
	});
	it('create instance named', ()=>{
		const MyType = new Type({name:'MyType', parse(str){return null}, stringify(){return 'null'}});
		assert.ok(MyType instanceof Type);
		assert.equal(MyType.isAbstract, false);
		assert.equal(MyType.name, 'MyType');
		assert.ok(MyType.parse instanceof Function);
		assert.ok(MyType.stringify instanceof Function);
	});
	describe('generic', ()=>{
		const Generic = new Type({
			name:'Generic',
			isAbstract:true,
			specify(count){
				return new Type({
					template:this,
					params:[count],
					faces:[this],
					parse(str){
					},
					stringify(value){
						return 'Generic:'+count;
					}
				});
			}
		});
		it('specify method', ()=>{
			assert.ok(Generic.specify instanceof Function);
		});
		it('specified type', ()=>{
			const Spec = Generic.specify(3);
			assert.ok(Spec instanceof Type);
		});
	});
	describe('Compare types', ()=>{
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
		describe('isEqual', ()=>{
			const Integer = new Type({
				name:'Integer',
				faces:[Number],
				parse(str){
					return parseInt(str);
				},
				stringify(value){
					return ""+value;
				}
			});
			it('Int equal Int', ()=>{
				assert.ok(Int.isEqual(Int));
			});
			it('Int equal new Integer', ()=>{
				assert.ok(Int.isEqual(Integer));
			});
			it('Int is not equal Number', ()=>{
				assert.ok(!Int.isEqual(Number));
			});
			it('Int is not equal Float', ()=>{
				assert.ok(!Int.isEqual(Float));
			});
			it('Vector<3> equal Vector<3>', ()=>{
				assert.ok(Vector.specify(3).isEqual(Vector.specify(3)));
			});
			it('Vector<2> not equal Vector<3>', ()=>{
				assert.ok(!Vector.specify(2).isEqual(Vector.specify(3)));
			});
			
		});
		describe('implements type', ()=>{
			it('int implements number', ()=>{
				assert.ok(Int.isImplements(Number));
			});
			it('float implements number', ()=>{
				assert.ok(Float.isImplements(Number));
			});
			it('byte implements number', ()=>{
				assert.ok(Byte.isImplements(Number));
			});
			it('byte not implements float', ()=>{
				//console.log(...Byte.allImplements());
				assert.ok(!Byte.isImplements(Float));
			});
			it('Vector<3> implements Vector', ()=>{
				assert.ok(Vector.specify(3).isImplements(Vector));
			});
			
		});
		
		describe('paramImplements', ()=>{
			it('(int, byte) implements (number, byte)', ()=>{
				assert.ok(Type.paramImplements([Int, Byte], [Number, Byte]));
			});
			it('(int, byte) implements (int, int)', ()=>{
				assert.ok(Type.paramImplements([Int, Byte], [Int, Int]));
			});
			it('(int, byte) implements (number, number)', ()=>{
				assert.ok(Type.paramImplements([Int, Byte], [Number, Number]));
			});
			it('(int, byte) not implements (byte, number)', ()=>{
				assert.ok(!Type.paramImplements([Int, Byte], [Byte, Number]));
			});
			it('(int, byte) not implements (number, float)', ()=>{
				assert.ok(!Type.paramImplements([Int, Byte], [Number, Float]));
			});
		});
	});
	describe('TypedValue', ()=>{
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
		it('from', ()=>{
			let val = Int.from(123);
			assert.equal(val.value, 123);
			assert.equal(val.type, Int);
		});
		it('toString', ()=>{
			let val = Int.from(123);
			assert.equal(""+val, '123');
		});
		it('valueOf', ()=>{
			let val = Int.from(123);
			assert.equal(1+val, 124);
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