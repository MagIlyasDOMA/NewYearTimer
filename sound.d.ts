declare class SoundPlayer {
    private audioContext;
    private sounds;
    private isAudioReady;
    private pendingSounds;
    constructor();
    private setupAudioUnlock;
    initializeAudio(): Promise<boolean>;
    private playPendingSounds;
    loadSound(name: string, url: string): Promise<void>;
    private playSoundInternal;
    playSound(name: string, volume?: number): void;
    isReady(): boolean;
    unlockAudio(): Promise<boolean>;
}
declare const soundPlayer: SoundPlayer;
//# sourceMappingURL=sound.d.ts.map