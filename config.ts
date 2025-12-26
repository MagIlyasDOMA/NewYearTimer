type TransparencyValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TimerBoxesCollection = HTMLCollectionOf<HTMLDivElement>;

interface NYTConfig {
    /**/
    year?: number; // Год
    sound?: boolean; // Включить звук
    soundIfIsHidden?: boolean; // Оставлять звук, если вкладка выключена
    timerTransparency?: TransparencyValue;
}

class Config {
    year: number;
    sound: boolean;
    soundIfIsHidden: boolean;
    private _timerTransparency: TransparencyValue

    constructor(options: NYTConfig) {
        this.year = options.year ?? 2026;
        this.sound = options.sound ?? true;
        this.soundIfIsHidden = options.soundIfIsHidden ?? false;
        this._timerTransparency = options.timerTransparency ?? 8;
        this.updateTimerTransparency(this._timerTransparency);
    }

    static get timerBoxes(): TimerBoxesCollection {
        return document.getElementsByClassName("timer-box") as TimerBoxesCollection;
    }

    private updateTimerTransparency(value: TransparencyValue): void {
        for (const timer of Config.timerBoxes) {
            timer.style.backgroundImage = `url("/timer_bg/${value}0.png")`
        }
    }

    get transparentTimer() {
        return this._timerTransparency;
    }

    set transparentTimer(value: TransparencyValue) {
        this._timerTransparency = value;
        this.updateTimerTransparency(value);
    }
}


(async function () {
    (window as any).config = new Config(await (await fetch('config.json')).json());
})()
