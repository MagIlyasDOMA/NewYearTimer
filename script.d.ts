interface TimeRemaining {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
declare class CountdownTimer {
    private config;
    private targetDate;
    private daysElement;
    private hoursElement;
    private minutesElement;
    private secondsElement;
    private daysBoxElement;
    private intervalId;
    private daysHidden;
    constructor(config: Config);
    private updateDaysVisibility;
    private updateDisplay;
    private calculateTimeRemaining;
    private formatNumber;
    private calculateProgress;
    startTimer(): void;
    stopTimer(): void;
    restartTimer(): void;
}
declare function initTimer(): Promise<void>;
//# sourceMappingURL=script.d.ts.map