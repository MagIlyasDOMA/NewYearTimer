"use strict";
class Config {
    constructor(options) {
        Object.defineProperty(this, "year", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "sound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "soundIfIsHidden", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_timerTransparency", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_useColon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.year = options.year ?? 2026;
        this.sound = options.sound ?? true;
        this.soundIfIsHidden = options.soundIfIsHidden ?? false;
        this._timerTransparency = options.timerTransparency ?? 8;
        this._useColon = options.useColon ?? true;
        this.updateTimerTransparency(this._timerTransparency);
        this.updateColon(this._useColon);
    }
    static get timerBoxes() {
        return document.getElementsByClassName("timer-box");
    }
    updateTimerTransparency(value) {
        for (const timer of Config.timerBoxes) {
            timer.style.backgroundImage = `url("https://magilyasdoma.github.io/timer_bg/${value}0.png")`;
        }
    }
    static get colonSeparators() {
        return document.getElementsByClassName("timer-separator");
    }
    get transparentTimer() {
        return this._timerTransparency;
    }
    set transparentTimer(value) {
        this._timerTransparency = value;
        this.updateTimerTransparency(value);
    }
    updateColon(value) {
        for (const separator of Config.colonSeparators) {
            separator.style.display = value ? "block" : "none";
        }
    }
    get useColon() {
        return this._useColon;
    }
    set useColon(value) {
        this._useColon = value;
        this.updateColon(value);
    }
}
(async function () {
    window.config = new Config(await (await fetch('config.json')).json());
})();
//# sourceMappingURL=config.js.map