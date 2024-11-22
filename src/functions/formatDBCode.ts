const formatDBCode = (input: string) => {
  return input.replace(/([A-Za-z])(\d)/, "$1 $2");
};

export default formatDBCode;
