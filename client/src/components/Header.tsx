import { Link, useLocation } from "wouter";
import { useMedia } from "react-use";
import { FaHome, FaUserFriends, FaBriefcase, FaBuilding, FaBell, FaTh, FaCaretDown, FaSearch } from "react-icons/fa";

const Header = () => {
  const [location] = useLocation();
  const isMobile = useMedia('(max-width: 768px)');

  const navItems = [
    { name: 'Home', icon: FaHome, path: '/' },
    { name: 'My Network', icon: FaUserFriends, path: '/network' },
    { name: 'Jobs', icon: FaBriefcase, path: '/jobs' },
    { name: 'SMB Solutions', icon: FaBuilding, path: '/smb' },
    { name: 'Notifications', icon: FaBell, path: '/notifications' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e0e0e0]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Left Section: Logo and Search */}
          <div className="flex items-center">
            <Link href="/" className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0a66c2" className="h-8 w-8">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </Link>
            <div className="relative hidden md:block ml-2">
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#f3f2ef] rounded-md py-2 px-3 pl-10 w-64 text-sm focus:outline-none" 
              />
              <FaSearch className="absolute left-3 top-2.5 text-[#666666]" />
            </div>
          </div>
          
          {/* Center: Navigation */}
          {!isMobile && (
            <nav className="flex items-center justify-center flex-1">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.path}
                  className={`nav-item ${location === item.path ? 'active' : ''}`}
                >
                  <item.icon className="text-xl mb-1" />
                  <span className="text-xs">{item.name}</span>
                </Link>
              ))}
            </nav>
          )}
          
          {/* Right: User Menu */}
          <div className="flex items-center">
            {!isMobile && (
              <div className="flex items-center">
                <button className="rounded-full overflow-hidden h-8 w-8 mr-1">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
                    alt="Profile Picture" 
                    className="h-full w-full object-cover" 
                  />
                </button>
                <div className="text-[#666666] hover:text-[#191919] cursor-pointer ml-1">
                  <FaCaretDown />
                </div>
              </div>
            )}
            <div className="ml-2 pl-3 border-l border-[#e0e0e0] flex items-center">
              <button className="text-[#0a66c2] font-semibold text-sm">
                <FaTh className="text-[#666666] text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobile && (
        <div className="flex justify-around border-t border-[#e0e0e0] py-2">
          {navItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.path}
              className={`flex flex-col items-center ${location === item.path ? 'text-[#0a66c2] font-semibold' : 'text-[#666666]'}`}
            >
              <item.icon className="text-xl" />
              <span className="text-xs">{index === 2 ? 'SMB' : item.name.split(' ')[0]}</span>
            </Link>
          ))}
          <Link href="/profile" className="flex flex-col items-center text-[#666666]">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" 
              alt="Profile" 
              className="h-6 w-6 rounded-full object-cover" 
            />
            <span className="text-xs">Me</span>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
