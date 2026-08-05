import { ConversationTurn, DifficultyLevel, InterviewMode, InterviewState, TurnAnalysis } from "./types";

export class ConversationMemory {
  private state: InterviewState;

  constructor(role: string, mode: InterviewMode, resumeText?: string) {
    this.state = {
      role,
      mode,
      resumeText,
      difficulty: "Medium",
      history: [],
      topicsCovered: [],
      detectedMistakes: [],
      detectedStrengths: [],
      detectedWeaknesses: [],
      candidateConfidence: "Moderate",
      progress: 0,
      antiCheatWarnings: [],
    };
  }

  static fromState(existingState: InterviewState): ConversationMemory {
    const memory = new ConversationMemory(existingState.role, existingState.mode, existingState.resumeText);
    memory.state = { ...existingState };
    return memory;
  }

  public getState(): InterviewState {
    return this.state;
  }

  public recordTurn(
    question: string,
    answer: string,
    analysis?: TurnAnalysis,
    codeSnippet?: string,
    topic?: string,
    newDifficulty?: DifficultyLevel,
    newProgress?: number
  ): void {
    const turn: ConversationTurn = {
      question,
      answer,
      timestamp: Date.now(),
      codeSnippet,
      analysis,
    };

    this.state.history.push(turn);

    if (topic && !this.state.topicsCovered.includes(topic)) {
      this.state.topicsCovered.push(topic);
    }

    if (analysis) {
      if (analysis.detectedMistakes) {
        for (const m of analysis.detectedMistakes) {
          if (m && !this.state.detectedMistakes.includes(m)) {
            this.state.detectedMistakes.push(m);
          }
        }
      }
      if (analysis.detectedStrengths) {
        for (const s of analysis.detectedStrengths) {
          if (s && !this.state.detectedStrengths.includes(s)) {
            this.state.detectedStrengths.push(s);
          }
        }
      }
      if (analysis.detectedWeaknesses) {
        for (const w of analysis.detectedWeaknesses) {
          if (w && !this.state.detectedWeaknesses.includes(w)) {
            this.state.detectedWeaknesses.push(w);
          }
        }
      }

      const avgConfidence = (analysis.confidence + analysis.communication) / 2;
      if (avgConfidence >= 75) this.state.candidateConfidence = "High";
      else if (avgConfidence >= 45) this.state.candidateConfidence = "Moderate";
      else this.state.candidateConfidence = "Low";
    }

    if (newDifficulty) {
      this.state.difficulty = newDifficulty;
    } else if (analysis) {
      // Dynamic difficulty adjustment
      if (analysis.technicalAccuracy >= 80 && this.state.difficulty !== "Expert Level") {
        if (this.state.difficulty === "Easy") this.state.difficulty = "Medium";
        else if (this.state.difficulty === "Medium") this.state.difficulty = "Hard";
        else if (this.state.difficulty === "Hard") this.state.difficulty = "Expert Level";
      } else if (analysis.technicalAccuracy < 45 && this.state.difficulty !== "Easy") {
        if (this.state.difficulty === "Expert Level") this.state.difficulty = "Hard";
        else if (this.state.difficulty === "Hard") this.state.difficulty = "Medium";
        else if (this.state.difficulty === "Medium") this.state.difficulty = "Easy";
      }
    }

    if (typeof newProgress === "number") {
      this.state.progress = Math.min(100, Math.max(0, newProgress));
    } else {
      const estimatedTurns = 6;
      this.state.progress = Math.min(100, Math.round((this.state.history.length / estimatedTurns) * 100));
    }
  }

  public setDifficulty(difficulty: DifficultyLevel): void {
    this.state.difficulty = difficulty;
  }
}
