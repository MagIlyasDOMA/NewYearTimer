"use strict";
class CountdownTimer {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "targetDate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "daysElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "hoursElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minutesElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "secondsElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "daysBoxElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "intervalId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "daysHidden", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        this.targetDate = new Date(`January 1, ${this.config.year} 00:00:00`);
        this.daysBoxElement = document.querySelector('.timer-box:nth-child(1)');
        this.daysElement = document.getElementById('days');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
    }
    updateDaysVisibility(days) {
        if (days === 0 && !this.daysHidden) {
            this.daysBoxElement.classList.add('days-hidden');
            this.daysHidden = true;
        }
        else if (days > 0 && this.daysHidden) {
            this.daysBoxElement.classList.remove('days-hidden');
            this.daysHidden = false;
        }
    }
    updateDisplay() {
        const time = this.calculateTimeRemaining();
        this.updateDaysVisibility(time.days);
        this.daysElement.textContent = this.formatNumber(time.days);
        this.hoursElement.textContent = this.formatNumber(time.hours);
        this.minutesElement.textContent = this.formatNumber(time.minutes);
        this.secondsElement.textContent = this.formatNumber(time.seconds);
        if (!document.hidden || this.config.soundIfIsHidden) {
            if (soundPlayer.isReady() && this.config.sound) {
                soundPlayer.loadSound('clock', 'clock.mp3')
                    .then(() => {
                    soundPlayer.playSound('clock', 0.3);
                });
            }
        }
    }
    calculateTimeRemaining() {
        const now = new Date();
        const total = this.targetDate.getTime() - now.getTime();
        if (total <= 0) {
            return {
                total: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }
    formatNumber(num) {
        return num < 10 ? `0${num}` : num.toString();
    }
    calculateProgress() {
        const startDate = new Date('January 1, 2025 00:00:00');
        const totalDuration = this.targetDate.getTime() - startDate.getTime();
        const elapsed = Date.now() - startDate.getTime();
        let progress = (elapsed / totalDuration) * 100;
        progress = Math.max(0, Math.min(100, progress));
        return progress;
    }
    startTimer() {
        this.updateDisplay();
        this.intervalId = window.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    restartTimer() {
        this.stopTimer();
        this.targetDate = new Date(`January 1, ${this.config.year} 00:00:00`);
        this.startTimer();
    }
}
async function initTimer() {
    while (!window.config) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    const config = window.config;
    const timer = new CountdownTimer(config);
    timer.startTimer();
    window.timer = timer;
}
document.addEventListener('DOMContentLoaded', initTimer);
//# sourceMappingURL=script.js.map