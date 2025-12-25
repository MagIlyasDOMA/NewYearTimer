const YEAR = 2026;

interface TimeRemaining {
    total: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

class CountdownTimer {
    private targetDate: Date;
    private daysElement: HTMLElement;
    private hoursElement: HTMLElement;
    private minutesElement: HTMLElement;
    private secondsElement: HTMLElement;
    private intervalId: number | null = null;

    constructor() {
        // Устанавливаем целевое время - 1 января 2026 года
        this.targetDate = new Date('January 1, 2026 00:00:00');

        // Получаем элементы DOM
        this.daysElement = document.getElementById('days')!;
        this.hoursElement = document.getElementById('hours')!;
        this.minutesElement = document.getElementById('minutes')!;
        this.secondsElement = document.getElementById('seconds')!;
    }

    // Метод для расчета оставшегося времени
    private calculateTimeRemaining(): TimeRemaining {
        const now = new Date();
        const total = this.targetDate.getTime() - now.getTime();

        // Если время истекло
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

    // Метод для форматирования чисел (добавление ведущего нуля)
    private formatNumber(num: number): string {
        return num < 10 ? `0${num}` : num.toString();
    }

    // Метод для расчета прогресса
    private calculateProgress(): number {
        const startDate = new Date('January 1, 2025 00:00:00');
        const totalDuration = this.targetDate.getTime() - startDate.getTime();
        const elapsed = Date.now() - startDate.getTime();

        let progress = (elapsed / totalDuration) * 100;

        // Ограничиваем прогресс от 0 до 100%
        progress = Math.max(0, Math.min(100, progress));

        return progress;
    }

    // Метод для обновления отображения таймера
    private updateDisplay(): void {
        const time = this.calculateTimeRemaining();

        // Обновляем значения таймера
        this.daysElement.textContent = this.formatNumber(time.days);
        this.hoursElement.textContent = this.formatNumber(time.hours);
        this.minutesElement.textContent = this.formatNumber(time.minutes);
        this.secondsElement.textContent = this.formatNumber(time.seconds);

        // Воспроизводим звук только когда аудио готово
        // и только каждую секунду (когда секунды меняются)
        if (!document.hidden) {
            if (soundPlayer.isReady()) {
                soundPlayer.loadSound('clock', 'clock.mp3')
                    .then(() => {
                        soundPlayer.playSound('clock', 0.3);
                    })
            }
        }
    }

    // Метод для запуска таймера
    public startTimer(): void {
        // Сначала обновляем сразу, чтобы избежать задержки
        this.updateDisplay();

        // Затем обновляем каждую секунду
        this.intervalId = window.setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }

    // Метод для остановки таймера
    public stopTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    // Метод для перезапуска таймера
    public restartTimer(): void {
        this.stopTimer();
        this.targetDate = new Date(`January 1, ${YEAR} 00:00:00`);
        this.startTimer();
    }
}

// Инициализация и запуск таймера при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const timer = new CountdownTimer();
    timer.startTimer();

    // Экспорт для отладки (можно удалить в production)
    (window as any).timer = timer;
});