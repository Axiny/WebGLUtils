import Shader from './Shader';
import Buffer from './Buffer';
import ShaderSource from './ShaderSource';
import { 
    INDICES, 
    Log, 
    Type, 
    copy 
} from './utlis'

const log = new Log('Object3D');

class Object3D {

    #gl;
    #type;
    #shader = null;
    #sources;
    #size;
    #defines;
    #bufferCache = {};
    #dataCache = {};

    constructor ( data, size ) {

        this.#size = size;
        this.setVertexData(data);

    }

    set type ( type ) {

        this.#type = type;

    }

    get type () {

        return this.#type;

    }

    set size ( size ) {

        this.#size = size;

    }

    get size () {

        return this.#size;

    }

    set defines ( defines ) {

        this.#defines = defines;

    }

    get defines () {

        return this.#defines;

    }

    compileShader ( gl ) {

        const { vertex, fragment } = this.#sources;
        const vertexSource = vertex instanceof ShaderSource ? vertex.output() : vertex;
        const fragmentSource = fragment instanceof ShaderSource ? fragment.output() : fragment;

        const shader = new Shader(gl);
        shader.setSource(vertexSource, fragmentSource);

        this.#shader = shader;

        return shader;

    }

    useShader () {

        const shader = this.#shader;
        
        if (!Type.isNull(shader)) {

            shader.use();

        } else {

            log.error('the shader is not defined.');

        }

    }

    setData ( key, data ) {

        this.#dataCache[key] = data;
        const buffer = this.#bufferCache[key];

        if (buffer) {

            this.useShader();

            const type = buffer.type;

            switch (type) {

                case 'number' :
                case 'vector' :
                case 'matrix' : {
        
                    buffer.setUniformData(data);
                    break;
        
                }
    
                case 'buffer': {

                    buffer.bindData(data);
                    buffer.enable(this.#size);
                    break;
    
                }
    
                case 'indices' : {
    
                    buffer.bindData(data);
                    break;
    
                }
    
                case 'vertex' : {
    
                    buffer.setAttributeData(data);
                    break;
    
                }
    
                default : {
    
                    log.error(`the '${key}' Buffer type is not supported. Please provide a valid Buffer.`);
    
                }

            }

        }

    }

    getData ( key ) {

        return this.#dataCache[key];

    }

    setBuffer ( key, buffer ) {

        this.#bufferCache[key] = buffer;

    }

    getBuffer ( key ) {

        return this.#bufferCache[key];

    }

    setVertexData ( data ) {

        this.setData('a_Position', data);

    }

    setIndices ( data ) {

        this.setData(INDICES, new Uint32Array(data));

    }

    deleteIndices () {

        delete this.#dataCache[INDICES];
        delete this.#bufferCache[INDICES];

    }

    isIndicesMode () {

        return this.#dataCache[INDICES] !== undefined;

    }

    init ( gl ) {

        const G = this.#gl = gl;
        const dataCache = this.#dataCache;
        const bufferCache = this.#bufferCache;
        let shader = this.#shader;

        if (Type.isNull(shader)) {

            shader = this.compileShader(G);

        }

        shader.use();

        const defines = copy(this.#defines.vertex);
        delete defines['varying'];

        for (const qualifier in defines) {

            for (let i = 0; i < defines[qualifier].length; i++) {

                const variable = defines[qualifier][i];

                const type = variable.type;
                const name = variable.name;
                const isBuffer = variable.isBuffer;
                const data = dataCache[name];

                if (!bufferCache[name] && !Type.isUndefined(data)) {

                    const bufferType = isBuffer ? 'buffer' : Buffer.createTypeByData(data, type, qualifier);
                    const location = shader.getLocation(qualifier, name);

                    const buffer = new Buffer(G, bufferType);
                    buffer.location = location;

                    this.#bufferCache[name] = buffer;

                } else {

                    log.warn(`the '${name}' variable is not defined in the cache, or data is undefined`);
                    log.warn(`.init() dataCache[${name}]: ${data}`);
                    log.warn(`.init() bufferCache[${name}]: ${bufferCache[name]}`);
                    log.warn(`.init() type: ${this.type}`);

                }

            }

        }

        if (this.isIndicesMode()) {

            const buffer = new Buffer(G, INDICES);
            buffer.bindData(dataCache[INDICES]);

            this.#bufferCache[INDICES] = buffer;

        }

    }

    render () {

        const dataCache = this.#dataCache;

        this.useShader();

        for (const name in dataCache) {

            this.setData(name, dataCache[name]);

        }

    }

}

export default Object3D