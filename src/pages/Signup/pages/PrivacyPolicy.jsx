// import { privacyPolicyData, summaryPoints } from '../../../features/term-privacy/privacy-policy';
// import TermsPrivacyLayout from '../components/TermsPrivacyLayout';

// const SignUpPrivacyPolicy = () => {
//   return (
//     <TermsPrivacyLayout title={'Privacy Policy'} timeStamp={'Last Updated: October 18, 2024'}>
//       <div className="term_policy_paragraph mt-[5px] tablet:mt-[15px]">
//         <p>
//           This Privacy Notice for Foundation Internet Organization, Inc. ("we," "us," or "our") outlines how and why we
//           might collect, store, use, and/or share ("process") your information when you use our services ("Services").
//           This includes interactions such as:
//         </p>
//         <ul className="list-disc pl-4 tablet:pl-6">
//           <li className="term_policy_paragraph">
//             Visiting our website at https://on.foundation, or any of our websites that link to this notice.
//           </li>
//           <li className="term_policy_paragraph">
//             Engaging with us in other related ways, including sales, marketing, or events.
//           </li>
//         </ul>
//         <h4 className="term_policy_heading">Have Questions or Concerns?</h4>
//         <p>
//           Please read this notice to understand your privacy rights and choices. If you disagree with our policies and
//           practices, refrain from using our Services. For questions or concerns, reach out to us at
//           info@foundation-io.com.
//         </p>
//         <h4 className="term_policy_heading">SUMMARY OF KEY POINTS</h4>
//         <ul className="list-disc pl-4 tablet:pl-6">
//           {summaryPoints.map((item, index) => (
//             <li key={index + 1}>{item}</li>
//           ))}
//         </ul>
//         <p>For more details, review the full privacy notice.</p>
//         <ul className="mt-3 list-decimal pl-4 tablet:mt-6 tablet:pl-6">
//           {privacyPolicyData.map((item, index) => (
//             <li key={index}>
//               <h4 className="term_policy_heading">{item.point}</h4>
//               {item.sections ? (
//                 item.sections.map((section, secIndex) => (
//                   <div key={secIndex}>
//                     <h3 className="term_policy_subheading">{section.title}</h3>
//                     <p>{section.content}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p>{item.content}</p>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </TermsPrivacyLayout>
//   );
// };

// export default SignUpPrivacyPolicy;
