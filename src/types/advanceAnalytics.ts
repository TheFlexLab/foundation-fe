export interface AnalyzeModalProps {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  questStartData: any;
  update: boolean;
  selectedItem?: any | undefined;
  userQuestSettingRef?: any
}

export type PostAnswer = {
  id: number;
  question: string;
};

export type AddBadgeProps = {
  handleClose: () => void;
  questStartData: any;
  update?: boolean;
  selectedItem?: any;
  userQuestSettingRef?: any
};

export interface ActivityType {
  id: number;
  name: string;
}

export interface HideOptionProps extends AddBadgeProps {
  update: boolean;
  selectedItem: any;
}

export interface ActivityProps {
  state?: any;
  dispatch: any;
  type?: any;
  selectedItem?: any,
  update?: any,
  parentDropdown?: boolean;
}
