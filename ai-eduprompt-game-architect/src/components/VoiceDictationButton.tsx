import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceDictationButtonProps {
  value: string;
  onChange: (newValue: string) => void;
  lang: 'th' | 'en';
  onStatusChange?: (status: { type: 'success' | 'info' | 'error' | 'warning'; text: string } | null) => void;
}

export default function VoiceDictationButton({
  value,
  onChange,
  lang,
  onStatusChange
}: VoiceDictationButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check if speech recognition is supported
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === 'th' ? 'th-TH' : 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      if (onStatusChange) {
        onStatusChange({
          type: 'info',
          text: lang === 'th' ? 'กำลังบันทึกเสียง... กรุณาพูดใส่ไมโครโฟน' : 'Listening... Please speak into your microphone'
        });
      }
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        const cleanTranscript = transcript.trim();
        const newValue = value ? `${value.trim()} ${cleanTranscript}` : cleanTranscript;
        onChange(newValue);
        if (onStatusChange) {
          onStatusChange({
            type: 'success',
            text: lang === 'th' ? `พิมพ์ข้อความจากการพูดสำเร็จ: "${cleanTranscript}"` : `Dictated successfully: "${cleanTranscript}"`
          });
        }
      }
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = lang === 'th' ? 'เกิดข้อผิดพลาดในการบันทึกเสียง' : 'Voice input error occurred';
      if (event.error === 'not-allowed') {
        errorMessage = lang === 'th' 
          ? 'กรุณาอนุญาตสิทธิ์เข้าถึงไมโครโฟนเพื่อใช้งานพิมพ์ด้วยเสียง' 
          : 'Please grant microphone access permission to use voice input';
      } else if (event.error === 'no-speech') {
        errorMessage = lang === 'th' ? 'ตรวจไม่พบเสียงพูด กรุณาลองใหม่อีกครั้ง' : 'No speech detected. Please try again';
      }

      if (onStatusChange) {
        onStatusChange({
          type: 'error',
          text: errorMessage
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [lang, value, onChange, isSupported, onStatusChange]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSupported) {
      if (onStatusChange) {
        onStatusChange({
          type: 'warning',
          text: lang === 'th' ? 'เบราว์เซอร์ของคุณไม่รองรับการพิมพ์ด้วยเสียง (Web Speech API)' : 'Your browser does not support voice typing (Web Speech API)'
        });
      }
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.error(err);
      }
      setIsListening(false);
    } else {
      try {
        // Update language just in case it changed
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'th' ? 'th-TH' : 'en-US';
        }
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all duration-200 cursor-pointer border ${
        isListening
          ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse ring-2 ring-rose-100'
          : 'bg-[#FAF9FF] border-slate-200 text-slate-500 hover:border-[#673AB7] hover:text-[#673AB7]'
      }`}
      title={
        isListening
          ? lang === 'th' ? 'คลิกเพื่อหยุดบันทึก' : 'Click to stop listening'
          : lang === 'th' ? 'พิมพ์ด้วยเสียงพูด' : 'Voice to text dictation'
      }
    >
      {isListening ? (
        <>
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
          </span>
          <MicOff className="w-3 h-3 text-rose-500 shrink-0" />
          <span>{lang === 'th' ? 'หยุดบันทึก' : 'Stop Mic'}</span>
        </>
      ) : (
        <>
          <Mic className="w-3 h-3 text-[#673AB7] shrink-0" />
          <span>{lang === 'th' ? 'พูดเพื่อพิมพ์' : 'Dictate'}</span>
        </>
      )}
    </button>
  );
}
