export interface CreateOrConnectHashtag {
  hashtag: {
    connectOrCreate: {
      where: {
        name: string;
      };
      create: { name: string };
    };
  };
}

export const hashtagParse = (
  caption: string,
): CreateOrConnectHashtag[] | null => {
  //parse caption
  const hashtags = caption.match(/#[\w!@#$%^&*()_+\[\]\-={}가-힣]+/g);
  if (!hashtags) {
    return null;
  }

  return hashtags.map((hashtag) => ({
    hashtag: {
      connectOrCreate: {
        where: {
          name: hashtag,
        },
        create: {
          name: hashtag,
        },
      },
    },
  }));
};
