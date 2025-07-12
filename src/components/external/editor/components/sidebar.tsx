import React, {ReactNode} from 'react';

export const Sidebar = ({children}: { children: ReactNode }) => {
  return (
    <aside className="w-full h-full bg-[#161b22] overflow-auto">
      {children}
    </aside>
  )
}

export default Sidebar