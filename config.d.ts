type TransparencyValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type TimerBoxesCollection = HTMLCollectionOf<HTMLDivElement>;
interface NYTConfig {
    year?: number;
    sound?: boolean;
    soundIfIsHidden?: boolean;
    timerTransparency?: TransparencyValue;
    useColon: boolean;
}
declare class Config {
    year: number;
    sound: boolean;
    soundIfIsHidden: boolean;
    private _timerTransparency;
    private _useColon;
    constructor(options: NYTConfig);
    static get timerBoxes(): TimerBoxesCollection;
    private updateTimerTransparency;
    static get colonSeparators(): TimerBoxesCollection;
    get transparentTimer(): TransparencyValue;
    set transparentTimer(value: TransparencyValue);
    private updateColon;
    get useColon(): boolean;
    set useColon(value: boolean);
}
//# sourceMappingURL=config.d.ts.map