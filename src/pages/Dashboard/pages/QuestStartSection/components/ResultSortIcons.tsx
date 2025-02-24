import SortIcon from '../../../../../assets/SortIcon';

interface Props {
  questStartData: any;
  handleSortIconClick: any;
  selectedOption: number;
  contendedOption?: number;
  isEmbedResults?: boolean;
  postProperties?: string;
}

export default function ResultSortIcons({
  questStartData,
  handleSortIconClick,
  selectedOption,
  contendedOption,
  isEmbedResults,
  postProperties,
}: Props) {
  return (
    <>
      {((isEmbedResults && postProperties === 'Embed') || postProperties !== 'Embed') && (
        <>
          {questStartData?.whichTypeQuestion === 'yes/no' ||
          questStartData?.whichTypeQuestion === 'like/dislike' ||
          questStartData?.whichTypeQuestion === 'agree/disagree' ? (
            <div
              className={`absolute -top-[21px] tablet:-top-7 ${questStartData.type === 'embed' ? 'right-[52px] tablet:right-[98px]' : 'right-[73px] tablet:right-[140px]'}`}
            >
              <button
                onClick={() => {
                  handleSortIconClick(true);
                }}
              >
                <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
              </button>
            </div>
          ) : (
            <>
              <div className="absolute -top-[21px] right-[71px] tablet:-top-7 tablet:right-[140px]">
                <button
                  onClick={() => {
                    handleSortIconClick(true);
                  }}
                >
                  <SortIcon ass={selectedOption === 3 ? true : false} des={selectedOption === 2 ? true : false} />
                </button>
              </div>
              <div className="absolute -top-[21px] right-6 tablet:-top-7 tablet:right-[57px]">
                <button
                  onClick={() => {
                    handleSortIconClick(false);
                  }}
                >
                  <SortIcon
                    type={'contended'}
                    ass={contendedOption === 3 ? true : false}
                    des={contendedOption === 2 ? true : false}
                  />
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
