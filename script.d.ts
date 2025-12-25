declare const YEAR = 2026;
interface TimeRemaining {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
declare class CountdownTimer {
    private targetDate;
    private daysElement;
    private hoursElement;
    private minutesElement;
    private secondsElement;
    private intervalId;
    constructor();
    private calculateTimeRemaining;
    private formatNumber;
    private calculateProgress;
    private updateDisplay;
    startTimer(): void;
    stopTimer(): void;
    restartTimer(): void;
}
//# sourceMappingURL=script.d.ts.map