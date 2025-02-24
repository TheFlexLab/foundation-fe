import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../../../../components/ui/Button';
import { getQuestById } from '../../../../../../services/api/homepageApis';
import Topbar from '../../../../components/Topbar';
import Loader from '../../../../../../components/ui/Loader';
import DashboardLayout from '../../../../components/DashboardLayout';
import AdvanceAnalytics from '../../../../../features/advance-analytics';
import QuestionCardWithToggle from '../../../QuestStartSection/components/QuestionCardWithToggle';
import AAParticipate from '../../../../../features/advance-analytics/AAParticipate';
import { convertToAdvanceAnalyticsCSV, generateAdvanceAnalyticsCSV } from '../../../../../../utils/utils';

export default function SharedLinkResults() {
  const location = useLocation();
  const persistedUserInfo = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState(
    persistedUserInfo.role === 'guest' || persistedUserInfo?.role === 'visitor'
      ? 'All of Foundation'
      : 'My Audience Results'
  );

  const { data: allQuestData, isLoading } = useQuery({
    queryKey: ['sharedLinkResultAll'],
    queryFn: () =>
      getQuestById(persistedUserInfo?.uuid, location.state.questId, null, location.state.link, location.state.link),
  });

  const { data: questData, isLoading: questDataLoading } = useQuery({
    queryKey: ['sharedLinkResultShared'],
    queryFn: () =>
      getQuestById(
        persistedUserInfo?.uuid,
        location.state.questId,
        'SharedLink',
        location.state.link,
        location.state.link
      ),
  });

  function downloadCSV(singleQuestResp) {
    const csvData = generateAdvanceAnalyticsCSV(singleQuestResp);
    const csvContent = convertToAdvanceAnalyticsCSV(csvData);

    const filename = singleQuestResp?.Question.replace(/[.?\s]/g, '_').replace(/_+$/, '');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  }

  return (
    <>
      <Topbar />
      <div className="bg-[#F2F3F5] dark:bg-background-dark">
        <DashboardLayout>
          <div className="mx-auto h-[calc(100dvh-91px)] w-full max-w-[1440px] overflow-y-auto no-scrollbar tablet:h-[calc(100vh-70px)] laptop:mx-[331px] laptop:px-4 desktop:mx-auto desktop:px-0">
            {persistedUserInfo?.role === 'user' && (
              <div className="my-2 flex justify-center gap-[15px] tablet:gap-5 laptop:my-[14.82px] laptop:gap-[35px]">
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'All of Foundation'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('All of Foundation')}
                >
                  All of Foundation
                </Button>
                <Button
                  variant={'topics'}
                  className={`${
                    tab === 'My Audience Results'
                      ? 'border-[#4A8DBD] bg-[#4A8DBD] text-white'
                      : 'border-[#ACACAC] bg-white text-[#707175]'
                  }`}
                  onClick={() => setTab('My Audience Results')}
                >
                  My Audience Results
                </Button>
              </div>
            )}

            {isLoading || questDataLoading ? (
              <Loader />
            ) : tab === 'My Audience Results' ? (
              questData?.data.data[0] && (
                <div className="mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-[0px]">
                  <QuestionCardWithToggle
                    questStartData={questData?.data.data[0]}
                    postProperties={'sharedlink-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                  {persistedUserInfo.role === 'user' && (
                    <>
                      <div className="mx-auto max-w-[730px]">
                        <AAParticipate questStartData={questData?.data.data[0]} />
                      </div>
                      <div className="mx-auto max-w-[730px]">
                        <AdvanceAnalytics questStartData={questData?.data.data[0]} userQuestSettingRef={'true'} />
                      </div>
                      <div className="mx-auto mt-4 flex max-w-[730px] justify-end px-4 tablet:px-[0px]">
                        {questData?.data.data[0]?.participantsCount > 0 ? (
                          <Button variant="submit" onClick={() => downloadCSV(questData?.data.data[0])}>
                            Export results
                          </Button>
                        ) : (
                          <Button variant="hollow-submit" disabled={true}>
                            Export results
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )
            ) : (
              allQuestData?.data.data[0] && (
                <div
                  className={`${persistedUserInfo?.role === 'guest' || persistedUserInfo?.role === 'visitor' ? 'pt-5' : ''} mx-auto px-4 tablet:max-w-[730px] tablet:px-6 laptop:px-0`}
                >
                  <QuestionCardWithToggle
                    questStartData={allQuestData?.data.data[0]}
                    postProperties={'actual-results'}
                    SharedLinkButton={'shared-links-results-button'}
                  />
                </div>
              )
            )}
          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
