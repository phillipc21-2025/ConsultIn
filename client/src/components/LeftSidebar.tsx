import { FaChartLine, FaAd, FaUsers, FaTools } from "react-icons/fa";

const LeftSidebar = () => {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      {/* Profile Card */}
      <div className="linkedin-card mb-4 overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-[#0a66c2] to-blue-500"></div>
        <div className="px-4 pb-4 text-center relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
              alt="Profile" 
              className="rounded-full border-2 border-white h-16 w-16 object-cover mx-auto" 
            />
          </div>
          <div className="pt-10">
            <h3 className="font-semibold">Alex Morgan</h3>
            <p className="text-sm text-[#666666]">Small Business Owner at Morgan Craft Brewery</p>
            <div className="text-xs text-[#666666] mt-3 pt-3 border-t border-[#e0e0e0]">
              <p className="mb-1">Profile views: <span className="font-semibold">243</span></p>
              <p>Connection growth: <span className="font-semibold">+34</span></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Business Resources Card */}
      <div className="linkedin-card mb-4 p-4">
        <h3 className="font-semibold text-sm">Your Business Resources</h3>
        <ul className="mt-2 text-sm">
          <li className="py-1.5 flex items-center">
            <FaChartLine className="text-[#0a66c2] mr-2" /> Business Analytics
          </li>
          <li className="py-1.5 flex items-center">
            <FaAd className="text-[#0a66c2] mr-2" /> Advertising
          </li>
          <li className="py-1.5 flex items-center">
            <FaUsers className="text-[#0a66c2] mr-2" /> Networking Groups
          </li>
          <li className="py-1.5 flex items-center">
            <FaTools className="text-[#0a66c2] mr-2" /> Business Tools
          </li>
        </ul>
        <div className="mt-3 pt-3 border-t border-[#e0e0e0]">
          <a href="#" className="text-sm text-[#0a66c2] hover:underline">View all resources</a>
        </div>
      </div>
    </aside>
  );
};

export default LeftSidebar;
