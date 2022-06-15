class Type {

    static get ( p ) {

        const type = Object.prototype.toString.call(p);
        
        return type.slice(8, type.length - 1);

    }

    static isObject ( p ) {

        return this.get(p) === 'Object';

    }

    static isArray ( p ) {

        return this.get(p) === 'Array';

    }

    static isString ( p ) {

        return this.get(p) === 'String';

    }

    static isDate ( p ) {

        return this.get(p) === 'Date';

    }

    static isFunction ( p ) {

        return this.get(p) === 'Function';

    }

    static isNumber ( p ) {

        return this.get(p) === 'Number';

    }

    static isBoolean ( p ) {

        return this.get(p) === 'Boolean';
        
    }

    static isJSON ( p ) {

        return this.get(p) === 'JSON'

    }

    static isUndefined ( p ) {

        return this.get(p) === 'Undefined'

    }

    static isNull ( p ) {

        return this.get(p) === 'Null';

    }

}

export default Type