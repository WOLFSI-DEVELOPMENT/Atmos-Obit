import re

# 1. Update HomeLayout.tsx tab height and color
with open('src/components/HomeLayout.tsx', 'r') as f:
    hl = f.read()

hl = hl.replace(
    'className="absolute -top-9 left-2 right-2 bg-[#262626] rounded-t-2xl pt-2.5 px-4 pb-4 flex items-start gap-6 z-0"',
    'className="absolute -top-11 left-2 right-2 bg-[#2596be] rounded-t-2xl pt-3.5 px-4 pb-5 flex items-start gap-6 z-0 shadow-lg"'
)

with open('src/components/HomeLayout.tsx', 'w') as f:
    f.write(hl)

# 2. Update App.tsx speech recognition
with open('src/App.tsx', 'r') as f:
    app = f.read()

old_app_speech = """  const toggleHomeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isHomeListening) {
      setIsHomeListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsHomeListening(true);
      recognition.onend = () => setIsHomeListening(false);
      recognition.onerror = () => setIsHomeListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setNewProjectName(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsHomeListening(false);
    }
  };"""

new_app_speech = """  const toggleHomeSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isHomeListening) {
      setIsHomeListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsHomeListening(true);
      recognition.onend = () => setIsHomeListening(false);
      recognition.onerror = () => setIsHomeListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setNewProjectName(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsHomeListening(false);
    }
  };"""

if old_app_speech in app:
    app = app.replace(old_app_speech, new_app_speech)
    with open('src/App.tsx', 'w') as f:
        f.write(app)

# 3. Update ChatPanel.tsx speech recognition
with open('src/components/ChatPanel.tsx', 'r') as f:
    cp = f.read()

old_cp_speech = """  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your request directly.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };"""

new_cp_speech = """  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can type your request directly.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };"""

if old_cp_speech in cp:
    cp = cp.replace(old_cp_speech, new_cp_speech)
    with open('src/components/ChatPanel.tsx', 'w') as f:
        f.write(cp)

print("Voice and tab styling updated successfully!")
