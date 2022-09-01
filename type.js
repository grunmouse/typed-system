
 
/**
 * @typedef {object} TypedValue
 * @property {Type} type
 * @property {any} value
 */

/**
 * @typedef {(Type|primitive|Array<Type~ParamType>)} Type~ParamType
 */


/**
 * Сравнивает два массива параметров на равенство
 * экземпляры Type сравниваются с помощью метода equal,
 * массивы - сравниваются рекурсивно,
 * прочие значения сравниваются оператором ===
 * @param {Array<Type~ParamType>} a
 * @param {Array<Type~ParamType>} b
 * @returned {boolean}
 */
function paramEqual(a, b){
	return a.length === b.length && a.every((param, i)=>{
		if(param instanceof Type){
			return param.isEqual(b[i]);
		}
		else if(Array.isArray(param)){
			return Array.isArray(b[i]) && paramEqual(param, b[i]);
		}
		else{
			return param === b[i];
		}
	});
}

/**
 * Проверяет первый набор параметров на поддержку интерфейса второго
 * 
 * @param {Array<Type~ParamType>} type - проверяемый набор параметров
 * @param {Array<Type~ParamType>} face - набор условий для проверки
 * @returned {boolean}
 */
function paramImplements(type, face){
	return type.length === face.length && type.every((type, i)=>{
		let iface = face[i];
		if(type instanceof Type){
			if(iface instanceof Type){
				return type.isImplements(iface);
			}
			else if(Array.isArray(iface)){
				return iface.some((a)=>(a.includes(type)));
			}
			else{
				return false;
			}
		}
		else if(typeof type === 'number'){
			if(typeof iface === 'number'){
				return type === iface;
			}
			else if(Array.isArray(iface)){
				return iface.includes(type);
			}
			else{
				return false;
			}
		}
		else if(typeof type === 'string'){
			if(typeof iface === 'string'){
				return type === iface;
			}
			else if(Array.isArray(iface)){
				return iface.includes(type);
			}
			else{
				return false;
			}
		}
		else if(Array.isArray(type)){
			return Array.isArray(iface) && paramImplements(type, iface);
		}
		else{
			return type === iface;
		}
	});
}

/**
 * @class Type - класс, экземпляры которого представляют обрабатываемые типы
 */
class Type{
	
	/**
	 * @constructor
	 * @param {object} attributes - свойства (и методы), которые будут присвоены экземпляру
	 *
	 * @param {?string} attributes.name - имя типа
	 * @param {?Type)} attributes.template - тип, выступивший в роли шаблона спецификации данного типа
	 * 		Из атрибутов name и template хотя бы один должен быть задан
	 * @param {?Array<Type~ParamType>} attributes.params - параметры спецификации данного типа, если он создан из дженерика
	 * 		Атрибут params - обязателен, если задан template
	 *
	 * @param {?Iterable<Type>} attributes.faces - типы, интерфейс которых поддерживается данным типом, 
	 *		если задан template, то он должен быть среди них
	 *
	 * @param {?Function<(Type), (Type|null)>) attributes.getFace - функция, реализующая дополнительные проверки поддержки интерфейса
	 *		принимает типы, перечисленные в attributes.faces, возвращает точный тип, интерфейс которого поддерживается, или null, если данный 
	 *		дженерик не поддерживает данный интерфейс
	 *
	 * @param {boolean} attributes.isAbstract - признак абстрактного типа
	 * @param {?Function<(string, ...params), any>} attributes.parse - функция парсинга значения типа, может бросать SyntaxError при ошибке парсинга
	 * @param {?Function<(...any), any>} attributes.create - функция генерации значения из переданных аргументов
	 *		одна из функций - parse или create - обязательна для неабстрактных
	 * @param {?Function<(any, ...params), str>} attributes.stringify - функция сериализации значения типа, обязательна для неабстрактных
	 *
	 * @param {?Function<(...any), Type>} attributes.specify - функция, создающая новый тип на базе текущего типа, используя переданные параметры
	 *
	 * @param {any} attributes[] - на все прочие атрибуты ограничений не накладывается, они все будут добавлены в экземпляр
	 */
	constructor(attributes){
		for(let key in attributes){
			this[key] = attributes[key];
		}

		this.isAbstract = this.isAbstract || false;
		
		//Спецификация анонимного типа должна включать шаблон и параметры. Для именованного типа это не обязательно.
		let validSpec = this.name || this.template && this.params && this.params.length;
		if(!validSpec){
			throw new Error('Invalid a type specification');
		}
		
		//У абстрактного типа может не быть интерфейса parse/stringify, в противном случае они необходимы
		//Если тип не парсится, а создаётся из других объектов, то вместо parse может быть create
		let validFace = this.isAbstract || (this.parse || this.create) && this.stringify;
		if(!validFace){
			throw new Error('Invalid a type interface');
		}
	}
	

	/**
	 * @method parse(str, ...param) - метод парсинга значения, должен быть реализован в экземпляре, если тип не абстрактный и не составной
	 * @param {String} str - строка
	 * @param {ParamArray<any>} param - набор необязательных типоспецифичных параметров парсинга
	 */
	 
	/**
	 * @method create(...param) - метод создания значения, должен быть реализован в экземпляре, если тип не абстрактный и составной
	 * @param {ParamArray<any>} param - исходные данные для создания значения
	 */
	 
	/**
	 * @method stringify(value, ...param) - метод сериализации заначения, должен быть реализован в экземпляре, если тип не абстрактный
	 * @param {any} value - значение
	 * @param {ParamArray<any>} param - набор необязательных типоспецифичных параметров сериализации
	 */

	/**
	 * Сериализует тип
	 * @returned {string}
	 */
	toString(){
		let code = [];
		if(this.name){
			code.push(this.name);
		}
		if(this.template){
			if(code.length){
				code.push(' ');
			}
			code.push(this.template.toString());
		}
		if(this.params && this.params.length){
			code.push('<', this.params.map((a)=>(a.toString())).join(', '), '>');
		}
		return code.join('');
	}
	
	/**
	 * Проверяет переданный тип на равенство текущему
	 * @param {Type} type
	 * @returned {boolean}
	 */
	isEqual(type){
		let result = true;
		
		if(this.template){
			result = result && type.template && this.template.isEqual(type.template);
		}
		else{
			result = result && !type.template;
		}
		
		result = result && (this.name === type.name);
		
		if(this.params){
			result = result && type.params && Type.paramEqual(this.params, type.params);
		}
		else{
			result = result && !type.params;
		}

		return result;
	}
	
	/**
	 * Проверяет, поддерживает ли текущий тип интерфейс переданного типа
	 * @param {Type} type
	 * @returned {boolean}
	 */
	isImplements(type){
		return !!this.getImplementation(type);
	}
	
	/**
	 * Ищет переданный тип в дереве интерфейсов, поддерживаемых текущим типом
	 * @param {Type} type
	 * @returned {Type}
	 */
	getImplementation(type){
		//поиск в ширину в орграфе интерфейсов
		const queue = [this], index = 0;
		for(let current of this.allImplements()){
			if(current.isEqual(type)){
				return current;
			}
		}
		return undefined;
	}
	
	/**
	 * Генератор обхода графа поддерживаемых интерфейсов в ширину
	 * @returned {Iterable<Type>}
	 */
	* allImplements(){
		const queue = [this];
		let index = 0;
		while(index < queue.length){
			let current = queue[index++];
			yield current;
			if(current.faces){
				for(let face of current.faces){
					if(!queue.includes(face)){
						queue.push(face);
					}
				}
			}
		}
	}
	
	/**
	 * Создаёт TypedValue, оборачивая переданное значения
	 * @param {any} value
	 * @returned {TypedValue}
	 */
	from(value){
		return Object.create(Object.prototype, {
			value:{
				value,
				enumerable:true
			},
			type:{
				value:this,
				enumerable:true
			},
			toString:{
				/**
				 * @param {ParamArray<any>} param - набор необязательных типоспецифичных параметров сериализации
				 */
				value:function(...param){
					return this.type.stringify(this.value, ...param);
				}
			},
			valueOf:{
				value:function(){
					return this.value.valueOf();
				}
			}
		});
	}
	
	/**
	 * Создаёт TypedValue, парся переданную строку
	 * @param {string} str
	 * @param {ParamArray<any>} param - набор необязательных типоспецифичных параметров парсинга
	 * @returned {TypedValue}
	 * @throws {SyntaxError}
	 */
	fromString(str, ...param){
		return this.from(this.parse(str, ...param));
	}
	
	/**
	 * Создаёт TypedValue, используя для создания значения метод create
	 */
	fromData(...data){
		return this.from(this.create(...data));
	}
}

Type.paramEqual = paramEqual;
Type.paramImplements = paramImplements;

module.exports = Type;