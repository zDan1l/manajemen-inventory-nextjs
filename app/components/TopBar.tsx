'use client';

const TopBar = () => {
  return (
    <div className="h-16 bg-white border-b-2 border-black sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="bg-yellow-300 border-2 border-black px-4 py-2">
            <h2 className="text-base font-bold text-black uppercase">Dashboard</h2>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          {/* <div className="bg-pink-200 border-2 border-black p-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <span className="text-base">🔔</span>
              <div className="w-4 h-4 bg-red-400 border border-black flex items-center justify-center">
                <span className="text-xs font-bold">3</span>
              </div>
            </div>
          </div> */}

          {/* Settings */}
          {/* <div className="bg-blue-200 border-2 border-black p-2 cursor-pointer">
            <span className="text-base">⚙️</span>
          </div> */}

          {/* User Profile */}
          <div className="bg-green-200 border-2 border-black p-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white border border-black flex items-center justify-center">
                <span className="text-xs font-bold">SA</span>
              </div>
              <span className="font-bold text-black text-sm">Admin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;