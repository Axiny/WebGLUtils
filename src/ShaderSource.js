import { PRECISION } from './utlis'

class ShaderSource {

    type;
    #precision = PRECISION.MIDDLE;
    #defines = '';
    #mainProcess = '';

    constructor ( type ) {

        this.type = type;

    }

    setPrecision ( precision ) {

        this.#precision = precision;

    }

    addDefines ( source ) {

        this.#defines += source;

    }

    setDefines ( source ) {

        this.#defines = source;

    }

    addMainProcess ( source ) {

        this.#mainProcess += source;

    }

    setMainProcess ( source ) {

        this.#mainProcess = source;

    }

    output () {

        const precision = `precision ${ this.#precision } float;`;
        this.#defines = precision.concat(this.#defines);

        return this.#generate();

    }

    static getDefineVariable ( defines ) {

        const res = { vertex : '', fragment : '' };

        for (const name in defines) {

            const define = defines[name];

            for (const key in define) {

                for (let i = 0; i < define[key].length; i++) {

                    const e = define[key][i];

                    res[name] += `${key} ${e.type} ${e.name};\n`;

                }

            }

        }

        return res;

    }

    #generate () {

        const source = `

        ${ this.#defines }

        void main () {

            ${ this.#mainProcess }

        }

        `

        return source;

    }

}

export default ShaderSource