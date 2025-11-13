/**
 * Interfaz para mensajes en el formato estándar de chat
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Configuración para proveedores de IA
 */
export interface AIProviderConfig {
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  baseURL?: string;
  [key: string]: any; // Permite configuraciones adicionales específicas del proveedor
}

/**
 * Respuesta de un proveedor de IA
 */
export interface AIResponse {
  content: string;
  model?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, any>;
}

/**
 * Interfaz abstracta para proveedores de IA
 * Permite implementar diferentes proveedores (OpenAI, Anthropic, Gemini, etc.)
 */
export interface IAIProvider {
  /**
   * Envía un mensaje al modelo de IA y obtiene una respuesta
   * @param messages Array de mensajes en formato de chat
   * @param config Configuración adicional para la solicitud
   * @returns Respuesta del modelo de IA
   */
  chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<AIResponse>;

  /**
   * Obtiene el nombre del proveedor
   */
  getProviderName(): string;
}


