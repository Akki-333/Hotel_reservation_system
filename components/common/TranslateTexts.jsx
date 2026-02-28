import React, { useState } from 'react';
import axios from 'axios';

const TranslateText = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('ta'); // Default: Tamil

  const translateText = async () => {
    try {
      const response = await axios.post('https://libretranslate.com/translate', {
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      setTranslatedText(response.data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate"
      />
      <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
        <option value="ta">Tamil</option>
        <option value="ms">Malay</option>
        <option value="de">German</option>
        <option value="fr">French</option>
      </select>
      <button onClick={translateText}>Translate</button>
      {translatedText && <p>Translated: {translatedText}</p>}
    </div>
  );
};

export default TranslateText;
