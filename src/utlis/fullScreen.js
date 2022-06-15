class FullScreen {

    #state = false;
    #target = null;

    constructor ( target ) {

        this.#target = target;

    }

    open () {

        this.#target.requestFullscreen();
        this.#state = true;

    }

    close () {

        document.exitFullscreen();
        this.#state = false;

    }

    toggle () {

        this.#state ? this.close() : this.open();

    }

}

export default FullScreen