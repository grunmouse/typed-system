import Type from './type.mjs';

const NumberType = new Type({
	name:'NumberType',
	parse(str){
		let code = str.toLowerCase();
		//Запятая в начале
		if(code.charAt(0) === '.'){
			code = '0'+code;
		}
		let e = code.split('e');
		if(e.length > 2){
			throw new SyntaxError(str);
		}
		//Экспонента в конце
		if(!e[1] || e[1].length === 0 || "+-".includes(e[1])){
			code = e[0];
		}
		else{
			code = e.join('e');
		}
			
		let result = Number(code);
		if(isNaN(result)){
			throw new SyntaxError(str);
		}
		return result;
	},
	stringify(value, toExp){
		toExp = toExp || value > Number.MAX_SAFE_INTEGER || value<Number.MIN_SAFE_INTEGER;
		if(toExp){
			return value.toExponential();
		}
		else{
			return ""+value;
		}
	}
});

export default NumberType;