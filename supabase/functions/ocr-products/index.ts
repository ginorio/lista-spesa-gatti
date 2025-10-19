import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log('Processing image with GPT-5-mini vision');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content: 'Sei un modello OCR specializzato nel riconoscimento di testo scritto a mano in immagini. Leggi attentamente ogni riga di testo presente nell\'immagine e trascrivila fedelmente, senza riassunti, interpretazioni o aggiunta di parole. Mantieni la sequenza originale delle righe dall\'alto verso il basso. Se non riesci a leggere una riga, inserisci una stringa vuota (\'\').Esempio di output atteso: ["Prima riga di testo", "Seconda riga di testo", "Terza riga di testo"]'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Leggi tutte le righe di testo nell\'immagine e restituisci un array JSON con ogni riga come stringa separata.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        max_completion_tokens: 1000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', JSON.stringify(data));
    
    const content = data.choices[0].message.content;
    
    // Try to parse the response as JSON array
    let products: string[] = [];
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      products = JSON.parse(cleanContent);
    } catch (e) {
      // If not valid JSON, split by newlines
      console.log('Failed to parse as JSON, splitting by newlines');
      products = content.split('\n').filter((line: string) => line.trim() !== '');
    }

    // Filter out empty strings
    products = products.filter((p: string) => p.trim() !== '');

    console.log('Recognized products:', products);

    return new Response(
      JSON.stringify({ products }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ocr-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
