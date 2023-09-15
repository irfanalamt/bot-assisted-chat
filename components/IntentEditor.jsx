import {useState, useEffect} from 'react';
import {TrashIcon} from '@heroicons/react/24/solid';

const IntentEditor = ({intent, handleCancel}) => {
  const [utterances, setUtterances] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    setUtterances(intent.utterances);
    setAnswers(intent.answers);
  }, [intent]);

  const addNewUtterance = () => {
    setUtterances([...utterances, '']);
  };

  const addNewAnswer = () => {
    setAnswers([...answers, '']);
  };

  const updateUtterance = (index, value) => {
    const updatedUtterances = [...utterances];
    updatedUtterances[index] = value;
    setUtterances(updatedUtterances);
  };

  const updateAnswer = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const deleteUtterance = (index) => {
    const updatedUtterances = utterances.filter((_, i) => i !== index);
    setUtterances(updatedUtterances);
  };

  const deleteAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);
  };

  return (
    <div className='flex flex-col p-6 bg-gray-50 rounded-lg shadow-lg max-w-xl mx-auto'>
      <h2 className='text-3xl text-center font-semibold pb-4 text-gray-800'>
        Intent - {intent.intentName} ({intent.intentType})
      </h2>

      <div className='my-4'>
        <h3 className='text-xl font-medium mb-2 text-gray-700'>Utterances</h3>
        <ul className='space-y-2'>
          {utterances.map((utterance, index) => (
            <li
              key={index}
              className='flex items-center bg-white p-2 rounded-lg shadow-sm'>
              <input
                type='text'
                value={utterance}
                onChange={(e) => updateUtterance(index, e.target.value)}
                className='flex-1 border rounded-lg px-3 py-2 outline-none transition duration-150 hover:border-gray-300 focus:border-blue-500'
              />
              <button onClick={() => deleteUtterance(index)} className='ml-2'>
                <TrashIcon className='w-5 h-5 text-red-500 hover:text-red-700 ' />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={addNewUtterance}
          className='mt-2 text-blue-500 hover:text-blue-700'>
          + Add Utterance
        </button>
      </div>

      {intent.intentType === 'FAQ' && (
        <div className='my-4'>
          <h3 className='text-xl font-medium mb-2 text-gray-700'>Answers</h3>
          <ul className='space-y-2'>
            {answers.map((answer, index) => (
              <li
                key={index}
                className='flex items-center bg-white p-2 rounded-lg shadow-sm'>
                <input
                  type='text'
                  value={answer}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  className='flex-1 border rounded-lg px-3 py-2 outline-none transition duration-150 hover:border-gray-300 focus:border-blue-500'
                />
                <button onClick={() => deleteAnswer(index)} className='ml-2'>
                  <TrashIcon className='w-5 h-5 text-red-500 hover:text-red-700 ' />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={addNewAnswer}
            className='mt-2 text-blue-500 hover:text-blue-700'>
            + Add Answer
          </button>
        </div>
      )}

      <div className='flex gap-4 mt-6'>
        <button
          className='flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300'
          onClick={handleCancel}>
          Cancel
        </button>
        <button
          className='flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300'
          onClick={handleCancel}>
          Save
        </button>
      </div>
    </div>
  );
};

export default IntentEditor;
