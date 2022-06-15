import { Type } from './utlis'

class WebGLContainer {

    #canvas;
    #gl;

    constructor ( canvas ) {

        this.#canvas = this.#checkCanvas(canvas);

        this.#gl = this.#canvas.getContext('webgl');

    }

    get context () {

        return this.#gl

    }

    get canvas () {

        return this.#canvas;

    }

    #checkCanvas ( canvas ) {

        let res = canvas;

        if ( canvas instanceof HTMLCanvasElement ) {

            res = document.createElement('canvas');
            res.style.display = 'block';

        }

        const width = res.parentElement.clientWidth;
        const height = res.parentElement.clientHeight;

        res.setAttribute('width', width);
        res.setAttribute('height', height);

        return res;

    }

}

export default WebGLContainer