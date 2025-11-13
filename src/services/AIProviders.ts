import { IAIProvider, ChatMessage, AIResponse, AIProviderConfig } from '../interfaces/shared/AIProvider';

/**
 * Proveedor de IA genérico que puede usar cualquier API HTTP
 * Permite usar cualquier modelo configurando la URL y formato
 */
export class GenericAIProvider implements IAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = {
      apiKey: config.apiKey || process.env.AI_API_KEY,
      model: config.model || process.env.AI_MODEL || 'gpt-3.5-turbo',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
      baseURL: config.baseURL || process.env.AI_BASE_URL || 'https://api.openai.com/v1',
      ...config
    };
  }

  async chat(messages: ChatMessage[], config?: AIProviderConfig): Promise<AIResponse> {
    const finalConfig = { ...this.config, ...config };
    const apiKey = finalConfig.apiKey;
    const baseURL = finalConfig.baseURL || 'https://api.openai.com/v1';
    const model = finalConfig.model || 'gpt-3.5-turbo';

    if (!apiKey) {
      throw new Error('API Key no configurada. Configure AI_API_KEY en las variables de entorno.');
    }

    try {
      // Detectar el tipo de proveedor basado en la URL
      if (baseURL.includes('openai.com') || baseURL.includes('api.openai.com')) {
        return await this.callOpenAI(messages, finalConfig);
      } else if (baseURL.includes('anthropic.com') || baseURL.includes('api.anthropic.com')) {
        return await this.callAnthropic(messages, finalConfig);
      } else if (baseURL.includes('generativelanguage.googleapis.com') || baseURL.includes('gemini')) {
        return await this.callGemini(messages, finalConfig);
      } else {
        // Formato genérico OpenAI-compatible
        return await this.callOpenAI(messages, finalConfig);
      }
    } catch (error) {
      throw new Error(`Error al comunicarse con el proveedor de IA: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  private async callOpenAI(messages: ChatMessage[], config: AIProviderConfig): Promise<AIResponse> {
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature,
        max_tokens: config.maxTokens
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined,
      metadata: data
    };
  }

  private async callAnthropic(messages: ChatMessage[], config: AIProviderConfig): Promise<AIResponse> {
    // Convertir formato de mensajes de OpenAI a Anthropic
    const systemMessages = messages.filter(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');
    
    const anthropicMessages = conversationMessages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await fetch(`${config.baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: config.model || 'claude-3-sonnet-20240229',
        max_tokens: config.maxTokens || 1024,
        temperature: config.temperature,
        system: systemMessages.length > 0 ? systemMessages[0].content : undefined,
        messages: anthropicMessages
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.content[0]?.text || '',
      model: data.model,
      usage: data.usage ? {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens
      } : undefined,
      metadata: data
    };
  }

  private async callGemini(messages: ChatMessage[], config: AIProviderConfig): Promise<AIResponse> {
    // Convertir formato de mensajes para Gemini
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const modelName = config.model || 'gemini-pro';
    const apiKey = config.apiKey;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: config.temperature,
            maxOutputTokens: config.maxTokens
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Error desconocido' } }));
      throw new Error(error.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    
    return {
      content: data.candidates[0]?.content?.parts[0]?.text || '',
      model: modelName,
      metadata: data
    };
  }

  getProviderName(): string {
    const baseURL = this.config.baseURL || '';
    if (baseURL.includes('openai')) return 'OpenAI';
    if (baseURL.includes('anthropic')) return 'Anthropic';
    if (baseURL.includes('gemini') || baseURL.includes('generativelanguage')) return 'Google Gemini';
    return 'Generic AI Provider';
  }
}

/**
 * Factory para crear proveedores de IA
 */
export class AIProviderFactory {
  static create(config?: AIProviderConfig): IAIProvider {
    const providerType = process.env.AI_PROVIDER || 'generic';
    
    switch (providerType.toLowerCase()) {
      case 'openai':
      case 'anthropic':
      case 'gemini':
      case 'generic':
      default:
        return new GenericAIProvider(config || {});
    }
  }

  static createCustom(baseURL: string, apiKey: string, model?: string): IAIProvider {
    return new GenericAIProvider({
      baseURL,
      apiKey,
      model: model || 'gpt-3.5-turbo'
    });
  }
}


