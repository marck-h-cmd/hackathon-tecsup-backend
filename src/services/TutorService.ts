// src/services/TutorService.ts
import { GenericAIProvider } from './AIProviders';
import { ChatMessage, AIResponse } from '../interfaces/shared/AIProvider';

export class TutorService {
    private aiProvider: GenericAIProvider;
    private systemPrompt: string;

    constructor(apiKey: string, baseURL: string, model: string) {
        this.aiProvider = new GenericAIProvider({
            apiKey,
            baseURL,
            model,
            temperature: 0.7,
            maxTokens: 1000
        });

        this.systemPrompt = this.buildSystemPrompt();
    }

    private buildSystemPrompt(): string {
        return `Eres un tutor académico personalizado especializado en matemáticas, programación y escritura académica.

FUNCIONES PRINCIPALES:
1. TUTORÍA ACADÉMICA: Explicar conceptos, resolver dudas, proporcionar ejemplos prácticos
2. ACOMPAÑAMIENTO: Guiar en el proceso de aprendizaje, sugerir recursos de estudio
3. EVALUACIÓN: Proporcionar ejercicios prácticos y verificar comprensión

PROTOCOLOS DE RESPUESTA:
- Para matemáticas: Explicar concepto → Ejemplo simple → Ejemplo complejo → Ejercicio propuesto
- Para programación: Explicar lógica → Mostrar código ejemplo → Señalar errores comunes
- Para escritura: Estructura → Buenas prácticas → Ejemplos de citación

ESTILO DE COMUNICACIÓN:
- Claro y directo, pero amable
- Adaptar la complejidad al nivel del estudiante
- Ser paciente y alentador
- Proporcionar retroalimentación constructiva

NUNCA:
- Des directamente las respuestas de tareas
- Seas condescendiente  
- Proporciones información incorrecta
- Ignores el nivel de comprensión del estudiante`;
    }

    async generateTutorResponse(
        userMessage: string,
        context: {
            subject: string;
            difficulty: 'beginner' | 'intermediate' | 'advanced';
            conversationHistory: ChatMessage[]
        }
    ): Promise<AIResponse> {
        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            ...context.conversationHistory,
            {
                role: 'user',
                content: this.enrichUserMessage(userMessage, context)
            }
        ];

        return await this.aiProvider.chat(messages);
    }

    private enrichUserMessage(
        userMessage: string,
        context: { subject: string; difficulty: string }
    ): string {
        return `[Asignatura: ${context.subject} | Nivel: ${context.difficulty}]
    
${userMessage}`;
    }

    async generateStudyRecommendation(
        performanceData: {
            subject: string;
            recentScores: number[];
            weakAreas: string[];
            studyTimeAvailable: number;
        }
    ): Promise<AIResponse> {
        const recommendationPrompt = `
    Genera recomendaciones de estudio personalizadas basadas en:
    
    DESEMPEÑO DEL ESTUDIANTE:
    - Asignatura: ${performanceData.subject}
    - Calificaciones recientes: ${performanceData.recentScores.join(', ')}
    - Áreas de mejora: ${performanceData.weakAreas.join(', ')}
    - Tiempo disponible: ${performanceData.studyTimeAvailable} horas/semana
    
    GENERA UN PLAN QUE INCLUYA:
    1. Distribución del tiempo de estudio
    2. Recursos específicos para las áreas débiles
    3. Ejercicios prácticos recomendados
    4. Técnicas de estudio sugeridas
    5. Metas semanales realistas
    
    Formato: Lista clara y accionable
    `;

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            {
                role: 'user',
                content: recommendationPrompt
            }
        ];

        return await this.aiProvider.chat(messages);
    }

    async explainConcept(
        concept: string,
        context: { subject: string; currentLevel: string }
    ): Promise<AIResponse> {
        const explanationPrompt = `
    Explica el concepto: "${concept}"
    
    Contexto:
    - Asignatura: ${context.subject}
    - Nivel del estudiante: ${context.currentLevel}
    
    Por favor:
    1. Define el concepto claramente
    2. Proporciona ejemplos prácticos
    3. Relaciona con conceptos previos
    4. Incluye una analogía si es posible
    5. Propone un ejercicio práctico
    `;

        const messages: ChatMessage[] = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            {
                role: 'user',
                content: explanationPrompt
            }
        ];

        return await this.aiProvider.chat(messages, {
            temperature: 0.3, // Más determinístico para explicaciones
            maxTokens: 1500
        });
    }
}