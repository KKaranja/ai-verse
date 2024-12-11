'use client';

import React, { useEffect, useState } from 'react';
import { countWords } from '../../Hisotry/Components/SingleHistoryItem';
import { useAppContext } from '@/app/AppContext';

function RemainingWords() {
  const {
    user,
    setUser,
    contentGeneratedObject: { contentGenerated },
    mainMenuItemsObject: { setMainMenuItems },
  } = useAppContext();

  const cumulativeWords = user?.cumulativeWords ?? 0;
  const isPro = user?.isPro ?? false;
  const progressText = `${cumulativeWords} / ${
    isPro ? '100,000' : '1000'
  } words generated`;

  function progressBarCalculation() {
    const divider = isPro ? 100000 : 1000;
    const results = (cumulativeWords / divider) * 100;
    return results >= 100 ? 100 : results;
  }

  useEffect(() => {
    const wordCountContentGenerated = countWords(contentGenerated);

    if (user && wordCountContentGenerated > 0) {
      setUser({
        ...user,
        cumulativeWords: user.cumulativeWords + wordCountContentGenerated,
      });
    }
  }, [contentGenerated]);

  return (
    <div
      className={`   p-[18px] rounded-lg shadow-md mt-24 mx-2   bg-gradient-to-r from-purple-600 to-purple-800`}
    >
      <h3 className="text-[15px] font-semibold mb-2 text-white ">
        AI-Generated Content
      </h3>
      <div className="w-full bg-gray-300 rounded-full h-1.5 mt-5 mb-2">
        <div
          className="bg-white h-1.5 rounded-full"
          style={{ width: `${progressBarCalculation()}%` }}
        ></div>
      </div>
      <p className="text-[10px] text-white mb-5">{progressText}</p>
      <span className="text-[11px] text-slate-400">{progressText}</span>
      {!user?.isPro && (
        <button
          onClick={() => {
            setMainMenuItems((prevArray) =>
              prevArray.map((singleItem) => ({
                ...singleItem,
                isSelected: singleItem.label === 'Subscriptions',
              }))
            );
          }}
          className="w-full text-[10px] bg-white text-purple-600 py-2 px-4 rounded-md hover:bg-slate-100 transition duration-300"
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  );
}

export default RemainingWords;
