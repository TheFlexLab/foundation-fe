import { FaCheck } from 'react-icons/fa6';
import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  steps: string[];
  isLabel: boolean;
}

export default function MultiStepCounter({ currentStep, steps, isLabel }: ProgressBarProps) {
  const stepCount = steps.length;

  return (
    <div className="mx-auto my-4 w-full min-w-fit">
      <div className={`${isLabel && 'pb-3'} flex justify-center`}>
        {steps.map((_, index) => {
          const isActive = index + 1 <= currentStep; // Step is completed or current
          const isLast = index === stepCount - 1; // Last step has no connector

          return (
            <React.Fragment key={index}>
              <div
                className={`mx-auto flex size-5 items-center justify-center rounded-full text-sm tablet:size-8 ${
                  isActive ? 'bg-blue-100 text-white' : 'border-2 border-gray-1 bg-white text-gray-1'
                }`}
              >
                <span className="w-fit text-center text-xs tablet:text-base">{isActive ? <FaCheck /> : index + 1}</span>
              </div>
              {!isLast && (
                <div className="align-center flex w-1/6 content-center items-center align-middle">
                  <div className="align-center w-full flex-1 items-center rounded bg-gray-1 align-middle">
                    <div
                      className={`rounded py-[1px] text-center text-xs leading-none tablet:py-[2px] ${
                        index + 1 < currentStep ? 'bg-blue-100' : 'bg-gray-1'
                      }`}
                    ></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isLabel && (
        <div className="flex content-center text-center text-xs">
          {steps.map((label, index) => (
            <div key={index} className="flex-1">
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
