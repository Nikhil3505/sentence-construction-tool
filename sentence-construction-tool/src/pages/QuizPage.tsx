import React, { useEffect, useState } from 'react';
import axios from 'axios';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    axios.get('http://localhost:3001/questions').then(res => {
      setQuestions(res.data);
    });
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setCurrentIndex(prev => prev + 1);
          setSelected([]);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [currentIndex]);

  if (!questions.length) return <div>Loading...</div>;
  const question = questions[currentIndex];
  const blanks = new Array(question.blanks).fill(null);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Time Left: {timer}s</h2>
      <p className="mb-4">{question.sentence}</p>
      <div className="flex gap-2 mb-4">
        {blanks.map((_, i) => (
          <button key={i} onClick={() => {
            const updated = [...selected];
            updated[i] = '';
            setSelected(updated);
          }} className="border px-4 py-2 min-w-[60px]">{selected[i]}</button>
        ))}
      </div>
      <div className="flex gap-2">
        {question.options.map((opt: string, i: number) => (
          <button key={i} onClick={() => {
            const updated = [...selected];
            const emptyIndex = updated.indexOf(undefined) !== -1 ? updated.indexOf(undefined) : updated.indexOf('');
            if (emptyIndex !== -1) {
              updated[emptyIndex] = opt;
              setSelected(updated);
            }
          }} className="bg-blue-200 px-3 py-1 rounded">{opt}</button>
        ))}
      </div>
      <button className="mt-4 bg-green-400 px-4 py-2 rounded disabled:opacity-50"
        disabled={selected.filter(Boolean).length !== question.blanks}
        onClick={() => {
          setCurrentIndex(prev => prev + 1);
          setSelected([]);
          setTimer(30);
        }}>Next</button>
    </div>
  );
};

export default QuizPage;