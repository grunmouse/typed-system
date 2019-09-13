const assert = require('assert');
const Type = require('../type.js');
const NumberType = require('../number-type.js');

describe('NumberType', ()=>{
	describe('instance', ()=>{
		it('exist', ()=>{
			assert.ok(NumberType instanceof Type);
		});
		it('name', ()=>{
			assert.equal(NumberType.name, "NumberType");
		});
	});
	describe('parse', ()=>{
		it('integer', ()=>{
			let value = NumberType.parse('1234567');
			assert.equal(value, 1234567);
		});
		it('float', ()=>{
			let value = NumberType.parse('3.14159265358');
			assert.equal(value, 3.14159265358);
		});
		it('exponent', ()=>{
			let value = NumberType.parse('2.1e31');
			assert.equal(value, 2.1e+31);
		});
		it('partial float', ()=>{
			let value = NumberType.parse('3.');
			assert.equal(value, 3);
		});
		it('partial exponent', ()=>{
			let value = NumberType.parse('2.1e');
			assert.equal(value, 2.1);
			
			value = NumberType.parse('2.1e+');
			assert.equal(value, 2.1);
		});
		it('unexpected comma', ()=>{
			assert.throws(()=>(NumberType.parse('3.1415.')), SyntaxError);
		});
		it('unexpected exp', ()=>{
			assert.throws(()=>(NumberType.parse('3.1415e1e')), SyntaxError);
		});
		it('unexpected +', ()=>{
			assert.throws(()=>(NumberType.parse('3.1415e1+')), SyntaxError);
		});
	});
	
	describe('stringify', ()=>{
		it('integer', ()=>{
			let str = NumberType.stringify(1234);
			assert.equal(str, '1234');

			str = NumberType.stringify(Number.NAX_SAFE_INTEGER);
			assert.equal(str, ''+Number.NAX_SAFE_INTEGER);
			
		});
		it('float', ()=>{
			let str = NumberType.stringify(12.34);
			assert.equal(str, '12.34');
		});
		it('oversized integer', ()=>{
			let str = NumberType.stringify(Number.NAX_SAFE_INTEGER + 1);
			assert.equal(str, (Number.NAX_SAFE_INTEGER+1).toExponential());
		});		
		it('integer toExp', ()=>{
			let str = NumberType.stringify(1234, true);
			assert.equal(str, (1234).toExponential());
		});
		it('float toExp', ()=>{
			let str = NumberType.stringify(12.34, true);
			assert.equal(str, (12.34).toExponential());
		});

	});
});