import { 
  FaChartLine, 
  FaLightbulb, 
  FaUserFriends, 
  FaClock, 
  FaFilePdf, 
  FaCalculator, 
  FaFileContract, 
  FaVideo, 
  FaArrowRight 
} from "react-icons/fa";

const RightSidebar = () => {
  return (
    <aside className="hidden md:block w-80 flex-shrink-0">
      {/* Trending Topics Card */}
      <div className="linkedin-card mb-4 p-4">
        <h3 className="font-semibold text-lg mb-3">SMB Trending Topics</h3>
        <ul className="text-sm space-y-3">
          <li>
            <a href="#" className="flex items-start hover:text-[#0a66c2]">
              <FaChartLine className="mt-1 mr-2 text-[#0a66c2]" />
              <span>Supply chain optimization for small manufacturers</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start hover:text-[#0a66c2]">
              <FaLightbulb className="mt-1 mr-2 text-[#0a66c2]" />
              <span>Finding alternative suppliers during shortages</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start hover:text-[#0a66c2]">
              <FaUserFriends className="mt-1 mr-2 text-[#0a66c2]" />
              <span>Building co-op arrangements with competitors</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-start hover:text-[#0a66c2]">
              <FaClock className="mt-1 mr-2 text-[#0a66c2]" />
              <span>Inventory management strategies for perishables</span>
            </a>
          </li>
        </ul>
      </div>
      
      {/* Upcoming Events Card */}
      <div className="linkedin-card mb-4 p-4">
        <h3 className="font-semibold text-lg mb-3">Upcoming Events</h3>
        <div className="text-sm mb-4 pb-3 border-b border-[#e0e0e0]">
          <div className="font-semibold">Supply Chain Solutions Webinar</div>
          <div className="text-[#666666]">Tomorrow • 2:00 PM</div>
          <div className="mt-1 text-xs">Join industry experts discussing innovative approaches to craft brewery supply chain management.</div>
          <button className="mt-2 text-[#0a66c2] hover:underline text-xs font-semibold">Add to calendar</button>
        </div>
        <div className="text-sm">
          <div className="font-semibold">Brewery Owners Networking</div>
          <div className="text-[#666666]">Sep 24 • 6:30 PM</div>
          <div className="mt-1 text-xs">Virtual meetup for brewery owners to share challenges and solutions.</div>
          <button className="mt-2 text-[#0a66c2] hover:underline text-xs font-semibold">Add to calendar</button>
        </div>
      </div>
      
      {/* SMB Resources Card */}
      <div className="linkedin-card p-4">
        <h3 className="font-semibold text-lg mb-3">SMB Resources</h3>
        <ul className="text-sm space-y-2">
          <li>
            <a href="#" className="flex items-center hover:text-[#0a66c2]">
              <FaFilePdf className="mr-2 text-[#0a66c2]" />
              <span>Supply Chain Management Guide</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center hover:text-[#0a66c2]">
              <FaCalculator className="mr-2 text-[#0a66c2]" />
              <span>Inventory Cost Calculator</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center hover:text-[#0a66c2]">
              <FaFileContract className="mr-2 text-[#0a66c2]" />
              <span>Supplier Contract Templates</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center hover:text-[#0a66c2]">
              <FaVideo className="mr-2 text-[#0a66c2]" />
              <span>Brewery Supply Chain Masterclass</span>
            </a>
          </li>
        </ul>
        <a href="#" className="text-[#0a66c2] hover:underline font-semibold text-sm flex items-center justify-center mt-4">
          Browse all resources <FaArrowRight className="ml-1" />
        </a>
      </div>
    </aside>
  );
};

export default RightSidebar;
