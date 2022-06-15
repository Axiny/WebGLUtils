import Object3D from "./Object3D";
import { Log } from "./utlis";

const log = new Log('Scene');

class Scene {

    #gl = null;
    #renders = [];
    
    constructor () {}

    set context ( gl ) {

        this.#gl = gl;

    }

    get renders () {

        return this.#renders;

    }

    add () {

        for (let i = 0; i < arguments.length; i++) {

            const param = arguments[i];

            if (param instanceof Object3D) {

                const G = this.#gl;

                if (G != null) {

                    param?.init(G);

                }

                this.#renders.push(param);

            } else {

                log.error("the param type is not the WebGLRenderGraphicsType");
                
            }

        }

    }

}