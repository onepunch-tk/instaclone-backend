export interface CreateOrConnectHashtag {
  where: { hashtag: string };
  create: { hashtag: string };
}

export const hashtagParse = (
  caption: string,
): CreateOrConnectHashtag[] | null => {
  //parse caption
  const hashtags = caption.match(/#[\w!@#$%^&*()_+\[\]\-={}가-힣]+/g);
  if (hashtags) {
    return hashtags.map((hashtag) => ({
      where: {
        hashtag,
      },
      create: {
        hashtag,
      },
    }));
  }

  return null;
};
