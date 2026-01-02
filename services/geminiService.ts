
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateInvitation(guestName: string, tone: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Génère une invitation de mariage personnalisée et chaleureuse pour un invité nommé "${guestName}". Le ton doit être "${tone}". Le mariage concerne Moussa et Mariama. N'inclus pas de balises markdown, juste le texte de l'invitation.`,
      });
      return response.text || "Impossible de générer l'invitation pour le moment.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Désolé, une erreur est survenue lors de la génération de votre invitation.";
    }
  }

  async generateCongratulationMessage(guestName: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Écris un court message de félicitations poétique de la part de "${guestName}" pour les mariés Moussa et Mariama. Juste le texte.`,
      });
      return response.text || "Félicitations aux mariés !";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Félicitations et tous nos vœux de bonheur !";
    }
  }
}

export const geminiService = new GeminiService();
