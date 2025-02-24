export interface SuggestedPost {
  question: string;
  options: string[];
  postType: string;
  userCanAddOption: boolean;
  errorMessage: string | null;
}

export interface Suggestions {
  statement: string;
  options: string[];
  _id: any;
}
export interface findings {
  heading: String;
  content: String;
}

export interface PostArticlesCardProps {
  questStartData: any;
}
