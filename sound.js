"use strict";
class SoundPlayer {
    constructor() {
        Object.defineProperty(this, "audioContext", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "sounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "isAudioReady", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "pendingSounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        this.setupAudioUnlock();
    }
    setupAudioUnlock() {
        const unlockEvents = ['click', 'touchstart', 'keydown', 'pointerdown'];
        const unlockAudio = async () => {
            if (!this.isAudioReady) {
                await this.initializeAudio();
                unlockEvents.forEach(event => {
                    document.removeEventListener(event, unlockAudio);
                });
            }
        };
        unlockEvents.forEach(event => {
            document.addEventListener(event, unlockAudio, { once: true });
        });
    }
    async initializeAudio() {
        if (this.isAudioReady)
            return true;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const buffer = this.audioContext.createBuffer(1, 1, 22050);
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start();
            document.getElementById('click').style.display = 'none';
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.isAudioReady = true;
            console.log('Audio initialized successfully');
            this.playPendingSounds();
            return true;
        }
        catch (error) {
            console.error('Failed to initialize audio:', error);
            return false;
        }
    }
    playPendingSounds() {
        for (const pending of this.pendingSounds) {
            this.playSoundInternal(pending.name, pending.volume);
        }
        this.pendingSounds = [];
    }
    async loadSound(name, url) {
        if (!this.isAudioReady) {
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
        }
        catch (error) {
            console.error(`Failed to load sound ${name}:`, error);
        }
    }
    playSoundInternal(name, volume = 1.0) {
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
        }
        catch (error) {
            console.error(`Failed to play sound "${name}":`, error);
        }
    }
    playSound(name, volume = 1.0) {
        if (!this.isAudioReady) {
            this.pendingSounds.push({ name, volume });
            console.log(`Sound "${name}" queued for later playback`);
            return;
        }
        this.playSoundInternal(name, volume);
    }
    isReady() {
        return this.isAudioReady;
    }
    async unlockAudio() {
        return await this.initializeAudio();
    }
}
const soundPlayer = new SoundPlayer();
if (typeof window !== 'undefined') {
    window.soundPlayer = soundPlayer;
}
//# sourceMappingURL=sound.js.map