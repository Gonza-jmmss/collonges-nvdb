// import dynamicIconImports from "lucide-react/dynamicIconImports";

// const isValidIconName = (name: string): name is keyof typeof dynamicIconImports => {
//   return name in dynamicIconImports;
// };

// export default isValidIconName;

import * as IconsMD from "react-icons/md";


const isValidIconName = (name: string): name is keyof typeof IconsMD => {
  return name in IconsMD;
};

export default isValidIconName;