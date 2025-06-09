import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RoomNumber = number | '6+';
type IntentionType = 'visit' | 'buy' | 'no-plan' | 'other-project';

interface IntentionButton {
  value: IntentionType;
  label: string;
}

function EstimationRechercher(): JSX.Element {
  const [roomCount, setRoomCount] = useState<RoomNumber>(2);
  const [apartmentSize, setApartmentSize] = useState<string>('');
  const [intention, setIntention] = useState<IntentionType | null>(null);
  const navigate = useNavigate();

  const roomNumbers: RoomNumber[] = [1, 2, 3, 4, 5, '6+'];

  const intentionButtons: IntentionButton[] = [
    { value: 'visit', label: 'Je prévois de le visiter' },
    { value: 'buy', label: 'Je compte faire une offre' },
    { value: 'no-plan', label: "Je n'ai pas de projet d'acquisition pour l'instant" },
    { value: 'other-project', label: "J'ai un projet d'achat, mais pas pour cet appartement" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className=" max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 ">
        <h2 className="text-xl font-semibold mb-6 text-center">Combien de chambres y a-t-il dans votre appartement ?</h2>
        <p className="text-sm text-gray-600 mb-6 text-center px-20">
          Inclure le salon, la salle à manger, les chambres et les bureaux, mais exclure la cuisine, la salle de bain, le dressing et
          l'entrée.
        </p>

        <div className="flex gap-3 justify-center mb-6">
          {roomNumbers.map(number => (
            <button
              key={number}
              className={`
                px-7 py-5 rounded-lg
                ${
                  roomCount === number
                    ? 'bg-purple-100 text-purple-700 border-2 border-purple-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => setRoomCount(number)}
            >
              {number}
            </button>
          ))}
        </div>

        <div className="mb-6 text-center">
          <h3 className="text-lg font-medium ">Quelle est la superficie de votre appartement ?</h3>
          <input
            type="number"
            placeholder="m²"
            value={apartmentSize}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setApartmentSize(e.target.value)}
            className="w-1/6 items-center  px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6  text-center">
          <h3 className="text-lg font-medium mb-6">En ce qui concerne cet appartement</h3>
          <div className="space-y-3 max-w-md mx-auto">
            {intentionButtons.map(btn => (
              <button
                key={btn.value}
                className={`w-full py-3 rounded-lg text-sm ${
                  intention === btn.value ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setIntention(btn.value)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={() => navigate('/PrixEstime')}
            className="px-8 py-3 bg-purple-500 text-white font-medium rounded-lg hover:bg-purple-600 transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}

export default EstimationRechercher;
