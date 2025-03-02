import { Injectable } from '@angular/core';
import { GenerateContentResult, GoogleGenerativeAI } from '@google/generative-ai';
import { environment } from '../../environments/environment';

interface AIResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const apiKey = environment.googleApiKey; // 🔴 Replace with your API Key
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  // // 📌 AI-based Expense Categorization
  // async categorizeExpense(description: string): Promise<string> {
  //   try {
  //     const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  //     const prompt = `Classify the following expense description into one of these categories: Food & Drinks, Travel, Shopping, Bills, Entertainment, Other. Description: "${description}"`;

  //     const result = await model.generateContent(prompt);
  //     console.log("result from ai",result)
  //     return result.response.text(); // ✅ Returns category suggestion
  //   } catch (error) {
  //     console.error("AI categorization error:", error);
  //     return "Other"; // Default fallback
  //   }
  // }

  // // 📌 AI-based Spending Insights
  // async generateSpendingInsights(spendingData: any): Promise<string> {
  //   try {
  //     const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  //     const prompt = `Analyze the following spending data and provide insights with suggestions for saving money:\n${JSON.stringify(spendingData)}`;

  //     const result = await model.generateContent(prompt);
  //     return result.response.text(); // ✅ Returns spending insights
  //   } catch (error) {
  //     console.error("AI insights error:", error);
  //     return "Could not generate insights.";
  //   }
  // }
  async categorizeExpense(description: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const requestBody = {
        contents: [
          { 
            role: "user",
            parts: [{ text: `Classify this expense description into a category: Food & Drinks, Travel, Shopping, Bills, Entertainment, Other. Description: "${description}"` }]
          }
        ]
      };

      const result: GenerateContentResult = await model.generateContent(requestBody);
      
      return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Other"; // ✅ Extract response properly
    } catch (error) {
      console.error("AI categorization error:", error);
      return "Other"; // Default fallback
    }
  }

  async generateSpendingInsights(spendingData: any): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const requestBody = {
        contents: [
          { 
            role: "user",
            parts: [{ text: `Analyze the following spending data and give insights:\n${JSON.stringify(spendingData)}` }]
          }
        ]
      };

      const result: GenerateContentResult = await model.generateContent(requestBody);

      return result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate insights."; // ✅ Extract response properly
    } catch (error) {
      console.error("AI insights error:", error);
      return "Could not generate insights.";
    }
  }
}
