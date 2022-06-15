class Log {

    #title = '';

    constructor ( title ) {

        this.#title = title || 'LOG';

    }

    #getMessage ( msg ) {

        return `[${this.#title}]: ${msg}`;

    }

    set title ( title ) {

        this.#title = title;

    }

    error ( msg ) {

        throw new Error( this.#getMessage(msg) );

    }

    print ( msg ) {

        console.log( this.#getMessage(msg) );

    }

    printf ( msg ) {

        console.log( this.#getMessage(''), msg );

    }

    warn ( msg ) {

        console.warn( this.#getMessage(msg) );

    }

}