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

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    console.log('Processing image with Gemini Flash vision');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Sei un assistente OCR esperto specializzato nel riconoscimento di liste della spesa scritte a mano. Il tuo compito è:\n1. Leggere il testo scritto a mano nell\'immagine\n2. Correggere eventuali errori ortografici e ricondurre i prodotti ai loro nomi reali e corretti (es. "Bagnoscihuma" → "Bagnoschiuma", "Flautu" → "Flauti", "Pane in caseta" → "Pane in cassetta")\n3. Restituire SOLO un array JSON con ogni prodotto come stringa\n4. Mantenere l\'ordine dall\'alto verso il basso\n5. Ignorare immagini o elementi non testuali'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Leggi tutti i prodotti scritti nell\'immagine, correggi gli errori ortografici e normalizza i nomi dei prodotti. Restituisci un array JSON con i nomi corretti. Esempio: ["Bagnoschiuma", "Flauti", "Pane in cassetta"]'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      throw new Error(`Lovable AI error: ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data));
    
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
