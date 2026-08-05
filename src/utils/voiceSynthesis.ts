export class VoiceSynthesisManager {
  private static instance: VoiceSynthesisManager;
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voiceGender: "female" | "male" = "female";
  private speakingRate: number = 0.95;
  private speakingPitch: number = 1.0;

  private constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  public static getInstance(): VoiceSynthesisManager {
    if (!VoiceSynthesisManager.instance) {
      VoiceSynthesisManager.instance = new VoiceSynthesisManager();
    }
    return VoiceSynthesisManager.instance;
  }

  private initVoices(): void {
    if (!this.synth) return;
    const voices = this.synth.getVoices();

    // Prefer high quality Studio / Neural English voices
    const preferredVoices = voices.filter(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") ||
          v.name.includes("Natural") ||
          v.name.includes("Neural") ||
          v.name.includes("Premium") ||
          v.name.includes("Samantha") ||
          v.name.includes("Daniel") ||
          v.name.includes("Karen") ||
          v.name.includes("Alex"))
    );

    if (preferredVoices.length > 0) {
      if (this.voiceGender === "female") {
        this.selectedVoice =
          preferredVoices.find((v) => v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Female") || v.name.includes("Google US English")) ||
          preferredVoices[0];
      } else {
        this.selectedVoice =
          preferredVoices.find((v) => v.name.includes("Daniel") || v.name.includes("David") || v.name.includes("Male")) ||
          preferredVoices[0];
      }
    } else if (voices.length > 0) {
      this.selectedVoice = voices[0];
    }
  }

  public setGender(gender: "female" | "male"): void {
    this.voiceGender = gender;
    this.initVoices();
  }

  public setRate(rate: number): void {
    this.speakingRate = Math.min(1.5, Math.max(0.7, rate));
  }

  public setPitch(pitch: number): void {
    this.speakingPitch = Math.min(1.5, Math.max(0.7, pitch));
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices().filter((v) => v.lang.startsWith("en")) : [];
  }

  public speak(text: string, onStart?: () => void, onEnd?: () => void): void {
    if (!this.synth) {
      if (onStart) onStart();
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 3000);
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }
    utterance.rate = this.speakingRate;
    utterance.pitch = this.speakingPitch;

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceManager = VoiceSynthesisManager.getInstance();
