import "../scss/main.scss";

class Main {
    constructor() {
        this.buttons = document.querySelectorAll('.calc__button');
        this.input = document.querySelector('.calc__input');
        this.buttonBehavior(this.buttons);
        this.isActionActive = false;    //flaga dla resetowania okna input.value po wpisaniu pierwszej liczby
        this.mainNumber = null;
        this.actualOperation = null;
        this.operatorOn = false;
        this.isComaInNumber = false; //flaga informująca czy przecinek występuje w liczbie
        this.wrong = false;     //flaga niewłaściwego działania (dzielenia przez zero)
        window.addEventListener('keydown', (e) => {
            this.takeKeyValue(e);
        })
    }

    displayValue(value) {
        if (this.input.value.length < 15) this.input.value += value;
    }

    writeValue(value) {
        this.operatorOn = false;
        if (this.isActionActive) {   //jeśli wciśnięta flaga działania, zresetuj okno input.value
            this.input.value = '';
            this.isActionActive = false;
        };
        if (this.input.value.length > 0 && this.input.value.length < 2 && this.input.value.substr(0, 1) === '0' && value !== '.') { //jesli pierszą liczbą jest zero i następną nie jest przecinek -pomiń
            this.input.value = value;
        } else {                //warunek sprawiający, że przecinek nie pojawi się dwa razy
            if (value === '.' && !this.isComaInNumber) {
                this.displayValue(value);
                this.isComaInNumber = true;
            } else if (value === '.' && this.isComaInNumber) {
                return
            } else this.displayValue(value);
        };
    }

    resetAll() {
        this.isActionActive = false;
        this.mainNumber = null;
        this.actualOperation = null;
        this.input.value = '';
        this.isComaInNumber = false;
        this.wrong = false;
        this.operatorOn = false;
    }

    setAction(operation) {
        this.isActionActive = true; //zmiana flagi informującej, że został wciśnięty przycisk działania matematycznego
        this.chooseOperation(operation);
        this.actualOperation = operation;   //ustawienie znacznika aktualnej operacji (+,-,*)
    }

    specyfiyPrecission(nr) {    //określenie liczby znaków po przecinku i jeśli wynoszą zero, wyświetlenie całkowitej
        if (nr == 'Infinity' || isNaN(nr)) {
            this.input.value = "Wrong";
            this.wrong = true;
        } else {
            if (nr.toPrecision(10).toString().length > nr.toString().length) {
                this.input.value = nr;
            } else this.input.value = nr.toPrecision(10).toString();
        }
    }

    doMath() {
        if (this.wrong) { this.resetAll() } else {
            if (!this.operatorOn) {
                this.operatorOn = true;
                if (this.actualOperation === '+') {
                    const nrAddition = this.mainNumber + parseFloat(this.input.value);
                    this.specyfiyPrecission(nrAddition);
                }
                else if (this.actualOperation === '-') {
                    const nrSubstraction = this.mainNumber - parseFloat(this.input.value);
                    this.specyfiyPrecission(nrSubstraction);
                }
                else if (this.actualOperation === '*') {
                    const nrMultiplication = this.mainNumber * parseFloat(this.input.value);
                    this.specyfiyPrecission(nrMultiplication);
                }
                else if (this.actualOperation === '/') {
                    const nrDivision = this.mainNumber / parseFloat(this.input.value);
                    this.specyfiyPrecission(nrDivision);
                }
            }
        }
    }

    chooseOperation(operation) {
        if (!this.actualOperation) {
            this.mainNumber = parseFloat(this.input.value); //zapisanie pierwszej liczby z okna input.value
        }
        else {      //jeśli znacznik aktualnej operacji (+,-,*) nie wynosi null wykonaj działanie
            this.doMath();
            if (this.actualOperation === '=') {
                if (this.actualOperation === '=' && operation === '=') return //kończy funkcję, gdy dwukrotnie wciśnie się '='
                this.doMath();
            }
            this.mainNumber = parseFloat(this.input.value);
        }
    }

    takeKeyValue(e) {
        if (e.location === 3) {
            if (e.key !== '+' && e.key !== '-' && e.key !== '*' && e.key !== '/' && e.key !== 'Enter' && e.key !== ',') this.writeValue(e.key)
            else {                      //wpisuje albo kropkę albo znak działania matematyczneg
                if (e.key === ',') {
                    this.writeValue('.')
                } else {
                    this.setAction(e.key);
                    this.isComaInNumber = false;
                }
            }
        }
    }

    takeButtonValue(btn) {
        if (btn.classList.contains('calc__button--nr')) {
            if (btn.textContent === ',') btn.textContent = '.';
            this.writeValue(btn.textContent)
        } else if (btn.classList.contains('operation')) {
            this.setAction(btn.textContent);
            this.isComaInNumber = false;
        }
        else if (btn.classList.contains('cancel')) {
            this.resetAll();
        }
    }

    buttonBehavior(buttons) {
        buttons.forEach(e => e.addEventListener('mousedown', () => {
            e.classList.add('calc__button--active');
            this.takeButtonValue(e);
        }))
        buttons.forEach(e => e.addEventListener('mouseup', () => {
            e.classList.remove('calc__button--active');
        }))
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Main();
})
