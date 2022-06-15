import WebGLContainer from "./WebGLContainer";
import Scene from "./Scene";
import { Log } from "./utils";

const log = new Log('WebGLRender');

class WebGLRender {

    #gl;
    #scene = null;

    constructor ( canvas ) {

        const container = new WebGLContainer(canvas);
        this.#gl = container.context;

        const G = this.#gl;

        G.clearColor(0, 0, 0, 0);
        G.enable(G.DEPTH_TEST);
        G.enable(G.BLEND);

        this.extension('OES_element_index_uint');

    }

    extension ( name ) {

        this.#gl.getExtension(name);

    }

    init ( scene ) {

        const G = this.#gl;

        scene.context = G;
        this.#scene = scene;

        const renders = scene.renders;
        renders.forEach ((obj) => obj.init(G));        

    }

    render () {

        const G = this.#gl;
        const scene = this.#scene;

        G.clear(G.COLOR_BUFFER_BIT | G.DEPTH_BUFFER_BIT);

        if (scene instanceof Scene) {

            const renders = scene.renders;

            renders.forEach( obj => {

                obj.render();

                const type = obj.type;
                const isIndicesMode = obj.isIndicesMode();

                if (isIndicesMode) {

                    const count = obj.getIndices().length;

                    G.drawElements(G[type], count, G.UNSIGNED_INT, 0);

                } else {

                    const vertex = obj.getVertexData().length - 1;
                    const size = obj.size;
                    const count = vertex / size;

                    G.drawArrays(G[type], 0 ,count)

                }

            })

        } else {

            log.error("the 'WebGLRender.render' need call the 'WebGLRender.init' and try again.");

        }

    }

}

export default WebGLRender;