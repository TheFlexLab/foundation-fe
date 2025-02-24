import api from './Axios';

export const deleteMessage = async (data) => {
  return await api.delete(`/directMessage/delete`, {
    _id: data.id,
    reciever: data.reciever,
  });
};

export const createMessage = async (data) => {
  if (data.messageContext === "ByDomain") {
    const payload = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      message: data.message,
      type: data.type,
      draftId: data.draftId,
      uuid: data.uuid,
      ...(data.questForeignKey && { questForeignKey: data.questForeignKey }),
      ...(data?.options?.length > 0 && { options: data.options }),
      ...(data.to === 'Participants' || data.to === 'All' ? { readReward: data.readReward } : {}),
      platform: data.platform,
      sharedLinkOnly: data?.sharedLinkOnly,
      messageContext: data.messageContext,
      sendFdxAmount: data.sendFdxAmount,
    };
    return await api.post('/directMessage/sendPublic', payload);
  }
  else {
    const payload = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      message: data.message,
      type: data.type,
      draftId: data.draftId,
      uuid: data.uuid,
      ...(data.questForeignKey && { questForeignKey: data.questForeignKey }),
      ...(data?.options?.length > 0 && { options: data.options }),
      ...(data.to === 'Participants' || data.to === 'All' ? { readReward: data.readReward } : {}),
      platform: data.platform,
      sharedLinkOnly: data?.sharedLinkOnly,
    };
    return await api.post('/directMessage/send', payload);
  }
};

export const createDraftMessage = async (data) => {
  return await api.post('/directMessage/draft', {
    from: data.from,
    to: data.to,
    subject: data.subject,
    message: data.message,
    id: data.id,
    readReward: data.readReward,
    uuid: data.uuid,
    ...(data.questForeignKey && { questForeignKey: data.questForeignKey }),
    ...(data.options && { options: data.options }),
    platform: data.platform,
    messageContext: data.messageContext,
    sendFdxAmount: data.sendFdxAmount,
  });
};

export const viewMessage = async (data) => {
  return await api.post('/directMessage/view', {
    _id: data.id,
    sender: data.sender,
    receiver: data.receiver,
  });
};

export const getSentMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllSend/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getRecievedMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllReceive/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getDeletedMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllDeletedMessage/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const getDraftdMessages = async (uuid) => {
  try {
    return await api.get(`/directMessage/getAllDraft/${uuid}`);
  } catch (error) {
    console.log(err);
    toast.error(error.response.data.message.split(':')[1]);
  }
};

export const fetchOptionParticipants = async (data) => {
  const payload = {
    uuid: data.uuid,
    ...(data.questForeignKey && { questForeignKey: data.questForeignKey }),
    ...(data?.options?.length > 0 && { options: data.options }),
    sharedLinkOnly: data?.sharedLinkOnly,
  };

  return await api.post('/directMessage/getCountForOptions', payload);
};
