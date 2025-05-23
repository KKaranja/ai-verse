import { useAppContext } from '@/app/AppContext';
import { SingleTemplate } from '@/app/types/AppType';
import { FaHeart } from 'react-icons/fa';
import Checkbox from '@mui/material/Checkbox';
import { MdFavoriteBorder } from 'react-icons/md';
import { GiRoundStar } from 'react-icons/gi';
export default function TemplateSingleCard({
  singleTemplate,
}: {
  singleTemplate: SingleTemplate;
}) {
  const {
    user,
    isDarkModeObject: { isDarkMode },
    openContentGeneratorFormObject: { setOpenContentGeneratorForm },
    selectedTemplatesObject: { setSelectedTemplate },
    allTemplatesObject: { allTemplates, setAllTemplates },
    allHistoryDataObject: { allHistoryData },
    mainMenuItemsObject: { setMainMenuItems },
  } = useAppContext();

  function updateTheAllTemplates() {
    const copyAllTemplates = allTemplates.map((template) => {
      if (template.title === singleTemplate.title) {
        return { ...template, isFavorite: !template.isFavorite };
      }

      return template;
    });

    setAllTemplates(copyAllTemplates);
  }

  const sumTotalWords = allHistoryData.reduce((sum, item) => {
    if (item.template.toLowerCase() === singleTemplate.title.toLowerCase()) {
      return sum + item.totalWords;
    }
    return sum;
  }, 0);

  function goToTheProPlanPage() {
    setMainMenuItems((prevItems) =>
      prevItems.map((singleItem) => ({
        ...singleItem,
        isSelected: singleItem.label === 'Subscriptions' ? true : false,
      }))
    );
  }

  return (
    <div
      className={` ${
        isDarkMode
          ? 'bg-slate-800 text-white'
          : 'bg-white border border-slate-100  '
      } p-5  flex flex-col justify-between gap-2
    rounded-lg h-[210px] relative  `}
    >
      {/* Icon and Title */}
      <div className="flex items-center gap-2 ">
        <div className="bg-purple-100 p-2 rounded-xl">
          {singleTemplate.icon}
        </div>
        <div className="relative">
          {!user?.isPro && (
            <>
              {singleTemplate.isForPro && (
                <GiRoundStar className="text-purple-600 text-[10px] absolute right-[-17px] top-[8px]" />
              )}
            </>
          )}

          <h2
            onClick={() => {
              const cumulativeWords = user?.cumulativeWords ?? 0;
              const isPro = user?.isPro ?? false;

              if (!isPro) {
                if (cumulativeWords >= 1000) {
                  goToTheProPlanPage();
                  return;
                }
                if (!singleTemplate.isForPro) {
                  setSelectedTemplate(singleTemplate);
                  setOpenContentGeneratorForm(true);
                } else {
                  goToTheProPlanPage();
                }
              } else {
                setSelectedTemplate(singleTemplate);
                setOpenContentGeneratorForm(true);
              }
            }}
            className=" text-[16px] font-semibold text-slate-400 hover:text-purple-600
        cursor-pointer"
          >
            {singleTemplate.title}
          </h2>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-600 mt-2 text-[12px]  ">
        {singleTemplate.description}
      </p>

      <div className="flex justify-between items-center">
        {/* Word Count */}
        <p className="text-slate-400 text-[12px] mt-4">
          {sumTotalWords} Words Generated
        </p>

        {/* Favorite Icon */}
        <div className="flex justify-end mt-4">
          <Checkbox
            onClick={updateTheAllTemplates}
            checked={singleTemplate.isFavorite}
            icon={<MdFavoriteBorder className="text-gray-300 text-[12px]" />}
            checkedIcon={<FaHeart className="text-gray-300 text-[12px]" />}
          />
        </div>
      </div>
    </div>
  );
}
