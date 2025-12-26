type TransparencyValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TimerBoxesCollection = HTMLCollectionOf<HTMLDivElement>;
interface NYTConfig {
    year?: number;
    sound?: boolean;
    soundIfIsHidden?: boolean;
    timerTransparency?: TransparencyValue;
}
declare class Config {
    year: number;
    sound: boolean;
    soundIfIsHidden: boolean;
    private _timerTransparency;
    constructor(options: NYTConfig);
    static get timerBoxes(): TimerBoxesCollection;
    private updateTimerTransparency;
    get transparentTimer(): TransparencyValue;
    set transparentTimer(value: TransparencyValue);
}
//# sourceMappingURL=config.d.ts.map