import { Log } from './utlis'

const log = new Log('Shader');

class Shader {

    #gl;
    #program;
    #VERTEX_SHADER;
    #FRAGMENT_SHADER;

    constructor ( gl ) {

        this.#gl = gl;

        this.#VERTEX_SHADER = gl.createShader(gl.VERTEX_SHADER);
        this.#FRAGMENT_SHADER = gl.createShader(gl.FRAGMENT_SHADER);

    }

    setSource ( vertex, fragment ) {

        const G = this.#gl;

        G.shaderSource(this.#VERTEX_SHADER, vertex);
        G.shaderSource(this.#FRAGMENT_SHADER, fragment);

        this.#compile(this.#VERTEX_SHADER, vertex);
        this.#compile(this.#FRAGMENT_SHADER, fragment);

        this.#createProgram();

    }

    getLocation ( type, name ) {

        const G = this.gl;
        const program = this.#program;
        this.use();

        switch (type) {

            case 'attribute': 
                return G.getAttribLocation(program, name);

            case 'uniform':
                return G.getUniformLocation(program, name);

        }

    }

    use () {

        this.#gl.useProgram(this.#program);
        
    }

    #compile ( shader, source ) {

        const G = this.gl;

        G.compileShader(shader);
        const state = G.getShaderParameter(shader, G.COMPILE_STATUS);

        if (!state) {

            log.warn(`gl.getShaderInfoLog: ${G.getShaderInfoLog(shader)}`);

            G.deleteShader(shader);

            log.warn(source);
            log.error('compiled the Shader is failed');

        }

    }

    #createProgram () {

        const G = this.#gl;

        const program = G.createProgram();
        G.attachShader(program, this.#VERTEX_SHADER);
        G.attachShader(program, this.#FRAGMENT_SHADER);

        this.#linkProgram(program);

    }

    #linkProgram ( program ) {

        const G = this.#gl;

        G.linkProgram(program);
        const state = G.getProgramParameter(program, G.LINK_STATUS);

        if (!state) {

            log.warn(`gl.getShaderInfoLog: ${G.getProgramInfoLog(program)}`);

            G.deleteProgram(program);

            log.error('linked the shader is failed');

        }

        this.#program = program;

    }

}

export default Shader