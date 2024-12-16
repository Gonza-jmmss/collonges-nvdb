// "use client";

// import { useSession } from "next-auth/react";
// import Icon from "@/components/common/icon";
// import isValidIconName from "@/functions/isValidIconName";

// export default function UserIcon({ isMouseOver }: { isMouseOver: boolean }) {
//   const { data: session, status } = useSession();

//   // If the session is loading or there is no user, return null
//   if (status === "loading" || !session?.user) return null;

//   return (
//     <>
//       {isMouseOver ? (
//         <div className="flex w-[85%] justify-center space-x-3">
//           <Icon
//             name={
//               isValidIconName("MdPersonOutline")
//                 ? "MdPersonOutline"
//                 : "MdOutlineNotInterested"
//             }
//             className="text-xl"
//           />
//           <span>{session.user.name}</span>
//         </div>
//       ) : (
//         <Icon
//           name={
//             isValidIconName("MdPersonOutline")
//               ? "MdPersonOutline"
//               : "MdOutlineNotInterested"
//           }
//           className="text-xl"
//         />
//       )}
//     </>
//   );
// }

//////

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";

export default function UserIcon({ isMouseOver }: { isMouseOver: boolean }) {
  const { data: session, status } = useSession();
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);

  // Update session loading state when session status changes
  useEffect(() => {
    if (status !== "loading") {
      setIsSessionLoaded(true);
    }
  }, [status]);

  // If the session is loading or there is no user, return null
  if (status === "loading" || !session?.user || !isSessionLoaded) return null;

  return (
    <>
      {isMouseOver ? (
        <div className="flex w-[85%] justify-center space-x-3">
          <Icon
            name={
              isValidIconName("MdPersonOutline")
                ? "MdPersonOutline"
                : "MdOutlineNotInterested"
            }
            className="text-xl"
          />
          <span>{session.user.name}</span>
        </div>
      ) : (
        <Icon
          name={
            isValidIconName("MdPersonOutline")
              ? "MdPersonOutline"
              : "MdOutlineNotInterested"
          }
          className="text-xl"
        />
      )}
    </>
  );
}
