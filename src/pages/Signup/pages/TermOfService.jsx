// import { termsAndConditionsArray } from '../../../features/term-privacy/term-of-service';
// import TermsPrivacyLayout from '../components/TermsPrivacyLayout';

// const TableOfContent = [
//   {
//     id: 1,
//     title: 'Our Services',
//     content: {
//       desc: 'Scope and Purpose:Foundation Internet Organization, Inc. offers a range of digital services including our website, on.foundation, and other related products and services. These are collectively aimed at reshaping how knowledge and data are created, shared, and monetized, empowering better decision-making worldwide.',
//       points: [
//         {
//           titie: 'Geographical Considerations',
//           desc: ' The Services are designed for a global audience but are not intended for use in any jurisdiction or country where such use would contradict local laws or regulations, or where we would be subject to registration requirements. Users accessing the Services from locations outside the United States do so on their initiative and are responsible for compliance with local laws to the extent they are applicable.',
//         },
//         {
//           titie: 'Industry-Specific Regulations Compliance',
//           desc: 'Our Services are not tailored to comply with industry-specific regulations such as the Health Insurance Portability and Accountability Act (HIPAA), the Federal Information Security Management Act (FISMA), or the Gramm-Leach-Bliley Act (GLBA). Therefore, if your interaction with our Services would be subject to such laws, you should not use our Services. Also, the Services should not be used in ways that violate the GLBA.',
//         },
//         {
//           titie: 'Use Limitations',
//           desc: 'Users should not use the Services for purposes that are unlawful or prohibited by these Terms. This includes any use that could damage, disable, overburden, or impair any Foundation Internet Organization server or the networks connected to any Foundation Internet Organization server.',
//         },
//         {
//           titie: 'Content and Accessibility',
//           desc: 'While we strive to keep the content on our Services up-to-date and accurate, we do not guarantee the completeness, accuracy, or usefulness of any information on the Services. The material on the Services is provided for general information only and should not be relied upon or used as the sole basis for making decisions.',
//         },
//         {
//           titie: 'Changes and Availability',
//           desc: 'We reserve the right to withdraw or amend our Services, and any service or material we provide on the Services, in our sole discretion without notice. We will not be liable if, for any reason, all or any part of the Services is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Services, or the entire Services, to users, including registered users.',
//         },
//         {
//           titie: '',
//           desc: '',
//         },
//         {
//           titie: '',
//           desc: '',
//         },
//       ],
//     },
//   },
//   { id: 2, title: 'Intellectual Property Rights' },
//   { id: 3, title: 'User Representations' },
//   { id: 4, title: 'User Registration' },
//   { id: 5, title: 'Products' },
//   { id: 6, title: 'Purchases and Payment' },
//   { id: 7, title: 'Refunds Policy' },
//   { id: 8, title: 'Prohibited Activities' },
//   { id: 9, title: 'User Generated Contributions' },
//   { id: 10, title: 'Contribution License' },
//   { id: 11, title: 'Guidelines for Reviews' },
//   { id: 12, title: 'Social Media' },
//   { id: 13, title: 'Third-Party Websites and Content' },
//   { id: 14, title: 'Advertisers' },
//   { id: 15, title: 'Services Management' },
//   { id: 16, title: 'Privacy Policy' },
//   { id: 17, title: 'Copyright Infringements' },
//   { id: 18, title: 'Term and Termination' },
//   { id: 19, title: 'Modifications and Interruptions' },
//   { id: 20, title: 'Governing Law' },
//   { id: 21, title: 'Dispute Resolution' },
//   { id: 22, title: 'Corrections' },
//   { id: 23, title: 'Disclaimer' },
//   { id: 24, title: 'Limitations of Liability' },
//   { id: 25, title: 'Indemnification' },
//   { id: 26, title: 'User Data' },
//   { id: 27, title: 'Electronic Communications, Transactions, and Signatures' },
//   { id: 28, title: 'California Users and Residents' },
//   { id: 29, title: 'Miscellaneous' },
//   { id: 30, title: 'Terms and Conditions Note' },
//   { id: 31, title: 'Contact Us' },
// ];

// const TermOfService = () => {
//   return (
//     <TermsPrivacyLayout title={'Terms Of Service'} timeStamp={'Last Updated: January 19, 2024'}>
//       <div className="term_policy_paragraph mt-[5px] tablet:mt-[15px]">
//         <h4 className="term_policy_heading">Agreement to Our Legal Terms</h4>
//         <p>
//           Foundation Internet Organization, Inc., a Delaware-registered company located at 651 N. Broad Street Suite
//           201, Middletown, DE 19709, United States, operates the website on.foundation and other related services.
//           Contact us at 7409738056, justin@foundation-io.com, or by mail at our address.
//         </p>
//         <p>
//           Your access and use of our services indicate your agreement to these Terms. If you do not agree, discontinue
//           use immediately. We will notify you of any significant changes to the services or these Terms. Continued use
//           after changes indicates your acceptance of the new terms.
//         </p>
//         <p>
//           The Services are intended for users aged 16 and above. We are not attorneys, nor do we specialize in law.
//           Foundation Internet Organization is simply trying to create something special so by agreeing to these terms,
//           you agree not to sue us unless we do something really bad on purpose.
//         </p>
//       </div>
//       <ul className="list-decimal">
//         {termsAndConditionsArray.map((section, index) => (
//           <li key={index}>
//             <h3 className="term_policy_subheading">{section.section}</h3>
//             <ul
//               className={
//                 section.section === 'Code of Conduct'
//                   ? 'list-decimal pl-2'
//                   : section.section === 'Contact Us'
//                     ? ' pl-2'
//                     : 'list-disc pl-2'
//               }
//             >
//               {section.content.map((content, contentIndex) => (
//                 <li key={contentIndex} className="term_policy_paragraph">
//                   <h3 className="term_policy_subheading">{content.heading}</h3>
//                   {content.subHeading && <h3 className="term_policy_subheading">{content.subHeading}</h3>}
//                   <p>{content.text}</p>
//                   {section.section === 'Contact Us' && <br />}
//                   <ul className={section.section !== 'Contact Us' && 'list-disc pl-6'}>
//                     {content.list && content.list.map((list) => <li>{list}</li>)}
//                   </ul>
//                   <ol className="list-decimal pl-6">{content.list2 && content.list2.map((list) => <li>{list}</li>)}</ol>
//                   <p>{content.text2}</p>
//                 </li>
//               ))}
//             </ul>
//             <br />
//             {section.endText && <p className="term_policy_paragraph">{section.endText}</p>}
//             {section.endText2 && <p className="term_policy_paragraph">{section.endText2}</p>}
//           </li>
//         ))}
//         <h3 className="term_policy_subheading">End of Terms of Use</h3>
//       </ul>
//     </TermsPrivacyLayout>
//   );
// };

// export default TermOfService;
