import { Log, Type, VARIABLE_TYPE } from './utlis'

const log = new Log('Buffer');

class Buffer {

    #gl;
    #buffer;
    #type;
    #location = null;
    #pointer = { size : 3, type : 0 }
    #data = { element : null, type : null }

    constructor (gl, type) {

        this.#gl = gl;
        this.#type = type;

        if (type === 'buffer' || type === 'indices') {

            this.#buffer = gl.createBuffer();

        }

    }

    set type ( type ) {

        this.#type = type;

    }

    get type () { 
    
        return this.#type; 
    
    }

    set location ( location ) {

        this.#location = location;

    }

    get location () {

        return this.#location;

    }

    bindData ( data ) {

        const type = this.#type;

        if (type === 'buffer' || type === 'indices') {

            const G = this.#gl;
            this.#data.type = Type.get(data);
            this.#data.element = data;
            const isIndices = this.#type === 'indices';

            const buffer = this.#buffer;
            const target = isIndices ? G.ELEMENT_ARRAY_BUFFER : G.ARRAY_BUFFER;
            const usage = isIndices ? G.STATIC_DRAW : G.STREAM_DRAW;

            G.bindBuffer(target, buffer);
            G.bufferData(target, data, usage);

            if (!this.#pointer.type) {

                this.#pointer.type = this.#getPointerType();

            }

        } else {

            log.warn("the buffer type is not supported, please use the 'buffer' or 'indices' property instead of other type.");

        }

    }

    enable ( size ) {

        if (this.#type === 'buffer') {

            const G = this.#gl;

            const location = this.#location;
            const type = this.#pointer.type;
            this.#pointer.size = size;

            const stride = 0;

            G.vertexAttribPointer(location, size, type, false, stride, 0);
            G.enableVertexAttribArray(location);

        } else {

            log.warn("the buffer type is not supported, please use the 'buffer' property instead of other type.");

        }

    }

    setUniformData ( data, location ) {

        const L = location || this.#location;
        const G = this.#gl;
        const isNumber = Type.isNumber(data);
        const type = this.#type;

        if (isNumber) {

            G.uniform1f(L, data);
            return;

        }

        const len = data.length;

        switch ( len ) {

            case 2: G.uniform2fv(L, data); break;
            case 3: G.uniform3fv(L, data); break;

            case 4: {

                if (type === 'vector') {

                    G.uniform4fv(L, data);
                    break;

                } else if (type === 'matrix') {

                    G.uniformMatrix2fv(L, false, data);
                    break;

                } else {

                    log.warn("the data's length is 4, but the type is not 'vertor' and 'matrix', please use setType() and try against.");

                }

            }

            case 9: G.uniformMatrix3fv(L, false, data); break;
            case 16: G.uniformMatrix4fv(L, false, data); break;

            default: log.warn("the data type is not supported.");

        }

    }

    setAttributeData ( data, location ) {

        const L = location || this.#location;
        const G = this.#gl;

        const len = data.length;

        switch ( len ) {

            case 1: G.vertexAttrib1fv(L, data); break;
            case 2: G.vertexAttrib2fv(L, data); break;
            case 3: G.vertexAttrib3fv(L, data); break;
            case 4: G.vertexAttrib4fv(L, data); break;

            default: log.warn("the data type is not supported");

        }

    }

    static createTypeByData ( data, type, qualifier ) {

        if (qualifier == "attribute") {

            if (data.length > 4) {

                return 'buffer';

            }

            return 'vertex';

        } else if (qualifier == "uniform") {

            if (Type.isNumber(data)) {

                return 'number';
    
            }
    
            let len = data.length;
    
            switch (len) {
    
                case 2: 
                case 3: return 'vector';
    
                case 4: {
    
                    if (type === VARIABLE_TYPE.VEC4) {
    
                        return 'vector';
    
                    } else {
    
                        return 'matrix';
    
                    }
    
                }
    
                case 9:
                case 16: return 'matrix';
    
                default: {
    
                    log.warn("the buffer type is undefined, please check the data or type and try again");
    
                }
    
            }

        } else {

            log.warn("the qualifier type is not 'attribute' or 'uniform'. Please check param and try again.");

        }

    }

    #getPointerType () {

        const G = this.#gl;
        const dataType = this.#data.type;

        switch (dataType) {

            case 'Float32Array'     : return G.FLOAT;
            case 'Uint16Array'      : return G.UNSIGNED_SHORT;
            case 'Int16Array'       : return G.SHORT;
            case 'Uint32Array'      : return G.UNSIGNED_INT;
            case 'Int32Array'       : return G.INT;
            case 'Int8Array'        : return G.BYTE;
            case 'Uint8Array'       : return G.UNSIGNED_BYTE;
            case 'Uint8ClampedArray': return G.UNSIGNED_BYTE;

            default: log.error("the data type is not supported.");

        }

    }

}

export default Buffer