type TransparencyValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TimerBoxesCollection = HTMLCollectionOf<HTMLDivElement>;

interface NYTConfig {
    /**/
    year?: number; // Год
    sound?: boolean; // Включить звук
    soundIfIsHidden?: boolean; // Оставлять звук, если вкладка выключена
    timerTransparency?: TransparencyValue;
    useColon: boolean;
}

class Config {
    year: number;
    sound: boolean;
    soundIfIsHidden: boolean;
    private _timerTransparency: TransparencyValue
    private _useColon: boolean;

    constructor(options: NYTConfig) {
        this.year = options.year ?? 2026;
        this.sound = options.sound ?? true;
        this.soundIfIsHidden = options.soundIfIsHidden ?? false;
        this._timerTransparency = options.timerTransparency ?? 8;
        this._useColon = options.useColon ?? true;
        this.updateTimerTransparency(this._timerTransparency);
        this.updateColon(this._useColon);
    }

    static get timerBoxes(): TimerBoxesCollection {
        return document.getElementsByClassName("timer-box") as TimerBoxesCollection;
    }

    private updateTimerTransparency(value: TransparencyValue): void {
        for (const timer of Config.timerBoxes) {
            timer.style.backgroundImage = `url("/timer_bg/${value}0.png")`
        }
    }

    static get colonSeparators(): TimerBoxesCollection {
        return document.getElementsByClassName("timer-separator") as TimerBoxesCollection;
    }

    get transparentTimer() {
        return this._timerTransparency;
    }

    set transparentTimer(value: TransparencyValue) {
        this._timerTransparency = value;
        this.updateTimerTransparency(value);
    }

    private updateColon(value: boolean) {
        for (const separator of Config.colonSeparators) {
            separator.style.display = value ? "block" : "none";
        }
    }

    get useColon() {
        return this._useColon;
    }

    set useColon(value: boolean) {
        this._useColon = value;
        this.updateColon(value);
    }
}


(async function () {
    (window as any).config = new Config(await (await fetch('config.json')).json());
})()
