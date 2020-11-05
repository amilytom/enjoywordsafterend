const Global = {
  base_url:
    process.env.NODE_ENV === "development"
      ? process.env.BASE_API
      : process.env.API_ROOT,
};

export default Global;
