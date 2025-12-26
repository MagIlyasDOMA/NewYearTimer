class SoundPlayer {
    private audioContext: AudioContext | null = null;
    private sounds: Map<string, AudioBuffer> = new Map();
    private isAudioReady: boolean = false;
    private pendingSounds: Array<{name: string, volume: number}> = [];

    constructor() {
        // Не создаем AudioContext сразу, ждем пользовательского взаимодействия
        this.setupAudioUnlock();
    }

    // Настройка разблокировки аудио
    private setupAudioUnlock(): void {
        const unlockEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];

        const unlockAudio = async () => {
            if (!this.isAudioReady) {
                await this.initializeAudio();
                unlockEvents.forEach(event => {
                    document.removeEventListener(event, unlockAudio);
                });
            }
        };

        // Добавляем обработчики на разные события
        unlockEvents.forEach(event => {
            document.addEventListener(event, unlockAudio, { once: true });
        });
    }

    // Инициализация аудио после пользовательского взаимодействия
    async initializeAudio(): Promise<boolean> { // Изменено на Promise<boolean>
        if (this.isAudioReady) return true;

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Создаем короткий беззвучный звук для разблокировки
            const buffer = this.audioContext.createBuffer(1, 1, 22050);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start();
            document.getElementById('click').style.display = 'none';

            // Проверяем состояние
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            this.isAudioReady = true;
            console.log('Audio initialized successfully');

            // Воспроизводим ожидающие звуки
            this.playPendingSounds();

            return true; // Возвращаем true при успехе

        } catch (error) {
            console.error('Failed to initialize audio:', error);
            return false; // Возвращаем false при ошибке
        }
    }

    // Воспроизведение ожидающих звуков
    private playPendingSounds(): void {
        for (const pending of this.pendingSounds) {
            this.playSoundInternal(pending.name, pending.volume);
        }
        this.pendingSounds = [];
    }

    // Загрузка звука
    async loadSound(name: string, url: string): Promise<void> {
        if (!this.isAudioReady) {
            // Если аудио еще не готово, пробуем инициализировать
            await this.initializeAudio();
        }

        if (!this.audioContext) {
            console.warn('Audio context not available');
            return;
        }

        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.sounds.set(name, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }

    // Внутренний метод воспроизведения
    private playSoundInternal(name: string, volume: number = 1.0): void {
        if (!this.audioContext) {
            console.warn('Audio context not initialized');
            return;
        }

        const buffer = this.sounds.get(name);
        if (!buffer) {
            console.warn(`Sound "${name}" not loaded`);
            return;
        }

        try {
            // Проверяем состояние контекста
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();

            source.buffer = buffer;
            gainNode.gain.value = volume;

            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            source.start();
        } catch (error) {
            console.error(`Failed to play sound "${name}":`, error);
        }
    }

    // Публичный метод воспроизведения звука
    playSound(name: string, volume: number = 1.0): void {
        if (!this.isAudioReady) {
            // Если аудио еще не готово, добавляем в очередь
            this.pendingSounds.push({ name, volume });
            console.log(`Sound "${name}" queued for later playback`);
            return;
        }

        this.playSoundInternal(name, volume);
    }

    // Проверка готовности аудио
    isReady(): boolean {
        return this.isAudioReady;
    }

    // Принудительная разблокировка аудио - возвращает Promise<boolean>
    async unlockAudio(): Promise<boolean> {
        return await this.initializeAudio();
    }
}

// Создаем глобальный экземпляр звукового плеера
const soundPlayer = new SoundPlayer();

// Экспортируем для использования в других файлах
if (typeof window !== 'undefined') {
    (window as any).soundPlayer = soundPlayer;
}