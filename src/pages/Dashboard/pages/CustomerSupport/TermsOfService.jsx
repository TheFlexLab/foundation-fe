import { termsAndConditionsArray } from '../../../../features/term-privacy/term-of-service';

const TermsOfService = () => {
  return (
    <div className="mb-12 bg-white pb-5 text-gray-1 dark:border-gray-100 dark:bg-gray-200 dark:text-gray-300 tablet:rounded-xl tablet:dark:border">
      <h1 className="py-3 pb-1 text-center text-[0.875rem] font-bold leading-[0.875rem] tablet:pb-[10px] tablet:pt-5 tablet:text-[1.25rem] tablet:leading-[1.25rem]">
        Terms Of Service
      </h1>
      <p className="text-center text-[0.6875rem] font-normal leading-[0.6875rem] tablet:text-[1.125rem] tablet:leading-[1.125rem]">
        Last Updated: October 18, 2024
      </p>
      <div className="term_policy_paragraph mt-[5px] space-y-[0.63rem] px-8 tablet:mt-[15px] tablet:space-y-2 tablet:px-16">
        <h4 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
          Agreement to Our Legal Terms
        </h4>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Foundation Internet Organization, Inc., a Delaware-registered company located at 651 N. Broad Street Suite
          201, Middletown, DE 19709, United States, operates the website on.foundation and other related services.
          Contact us at info@foundation-io.com, or by mail at our address.
        </p>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          Your access and use of our services indicate your agreement to these Terms. If you do not agree, discontinue
          use immediately. We will notify you of any significant changes to the services or these Terms. Continued use
          after changes indicates your acceptance of the new terms.
        </p>
        <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
          The Services are intended for users aged 16 and above. We are not attorneys, nor do we specialize in law.
          Foundation Internet Organization is simply trying to create something special so by agreeing to these terms,
          you agree not to sue us unless we do something really bad on purpose.
        </p>
      </div>
      <ul className="mt-[10px] list-decimal space-y-[0.63rem] px-8 tablet:space-y-2 tablet:px-16">
        {termsAndConditionsArray.map((section, index) => (
          <li key={index}>
            <h3 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
              {section.section}
            </h3>
            <ul
              className={
                section.section === 'Code of Conduct'
                  ? 'list-decimal pl-2'
                  : section.section === 'Contact Us'
                    ? 'pl-2'
                    : 'list-disc pl-6'
              }
            >
              {section.content.map((content, contentIndex) => (
                <li key={contentIndex} className="term_policy_paragraph">
                  <h3 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                    {content.heading}
                  </h3>
                  {content.subHeading && (
                    <h3 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
                      {content.subHeading}
                    </h3>
                  )}
                  <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    {content.text}
                  </p>
                  <ul className={section.section !== 'Contact Us' ? 'list-disc pl-6' : ''}>
                    {content.list && content.list.map((list, listIndex) => <li key={listIndex}>{list}</li>)}
                  </ul>
                  <ol className="list-decimal pl-6">
                    {content.list2 && content.list2.map((list, listIndex) => <li key={listIndex}>{list}</li>)}
                  </ol>
                  <p className="text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                    {content.text2}
                  </p>
                </li>
              ))}
            </ul>
            {section.endText && (
              <p className="term_policy_paragraph text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                {section.endText}
              </p>
            )}
            {section.endText2 && (
              <p className="term_policy_paragraph text-[0.6875rem] font-normal leading-[145.455%] tablet:text-[1.125rem] tablet:leading-normal">
                {section.endText2}
              </p>
            )}
          </li>
        ))}
        <h3 className="text-[0.75rem] font-bold leading-[0.875rem] tablet:text-[1.125rem] tablet:leading-[148%]">
          End of Terms of Use
        </h3>
      </ul>
    </div>
  );
};

export default TermsOfService;
