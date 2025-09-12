import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'english' } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Simple chatbot responses for St. Columba's College
    const responses = {
      english: {
        greeting: "Hello! I'm the St. Columba's College virtual assistant. How can I help you today?",
        admissions: "For admissions information, please visit our admissions page or contact our office at +91-6546-272XXX. We offer undergraduate and postgraduate programs.",
        departments: "We have various departments including Arts, Science, Commerce, and Computer Science. Each department offers excellent academic programs.",
        notices: "You can check the latest notices on our notices page. We regularly update information about examinations, events, and important announcements.",
        contact: "You can reach us at admin@stcolumbascollege.edu.in or call +91-6546-272XXX. Our office is open Monday to Friday, 9 AM to 5 PM.",
        faculty: "Our experienced faculty members are dedicated to providing quality education. You can find faculty information in the respective department sections.",
        default: "Thank you for your question about St. Columba's College. For specific information, please visit our website sections or contact our office directly."
      },
      hindi: {
        greeting: "नमस्ते! मैं सेंट कोलंबा कॉलेज का वर्चुअल सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
        admissions: "प्रवेश की जानकारी के लिए, कृपया हमारे प्रवेश पृष्ठ पर जाएं या +91-6546-272XXX पर हमारे कार्यालय से संपर्क करें। हम स्नातक और स्नातकोत्तर कार्यक्रम प्रदान करते हैं।",
        departments: "हमारे पास कला, विज्ञान, वाणिज्य और कंप्यूटर विज्ञान सहित विभिन्न विभाग हैं। प्रत्येक विभाग उत्कृष्ट शैक्षणिक कार्यक्रम प्रदान करता है।",
        notices: "आप हमारे नोटिस पृष्ठ पर नवीनतम सूचनाएं देख सकते हैं। हम परीक्षा, कार्यक्रम और महत्वपूर्ण घोषणाओं के बारे में नियमित रूप से जानकारी अपडेट करते हैं।",
        contact: "आप हमसे admin@stcolumbascollege.edu.in पर संपर्क कर सकते हैं या +91-6546-272XXX पर कॉल कर सकते हैं। हमारा कार्यालय सोमवार से शुक्रवार, सुबह 9 बजे से शाम 5 बजे तक खुला रहता है।",
        faculty: "हमारे अनुभवी संकाय सदस्य गुणवत्तापूर्ण शिक्षा प्रदान करने के लिए समर्पित हैं। आप संबंधित विभाग अनुभागों में संकाय की जानकारी पा सकते हैं।",
        default: "सेंट कोलंबा कॉलेज के बारे में आपके प्रश्न के लिए धन्यवाद। विशिष्ट जानकारी के लिए, कृपया हमारी वेबसाइट के अनुभागों पर जाएं या सीधे हमारे कार्यालय से संपर्क करें।"
      }
    };

    const lang = language.toLowerCase() === 'hindi' ? 'hindi' : 'english';
    const messageText = message.toLowerCase();

    let reply;
    if (messageText.includes('hello') || messageText.includes('hi') || messageText.includes('नमस्ते')) {
      reply = responses[lang].greeting;
    } else if (messageText.includes('admission') || messageText.includes('प्रवेश')) {
      reply = responses[lang].admissions;
    } else if (messageText.includes('department') || messageText.includes('विभाग')) {
      reply = responses[lang].departments;
    } else if (messageText.includes('notice') || messageText.includes('सूचना')) {
      reply = responses[lang].notices;
    } else if (messageText.includes('contact') || messageText.includes('संपर्क')) {
      reply = responses[lang].contact;
    } else if (messageText.includes('faculty') || messageText.includes('संकाय')) {
      reply = responses[lang].faculty;
    } else {
      reply = responses[lang].default;
    }

    return new Response(
      JSON.stringify({ reply, language: lang }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});