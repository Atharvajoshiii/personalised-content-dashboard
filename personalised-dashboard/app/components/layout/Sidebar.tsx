'use client';

import React, { useState } from 'react';
import { FiHome, FiTrendingUp, FiStar, FiMenu, FiX, FiGrid, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { RiDashboardFill } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const theme = useSelector((state: RootState) => state.theme.theme);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';
  
  const mobileVisibility = isMobileOpen ? 'left-0' : '-left-full';

  const handleNavClick = (tab: string) => {
    // First update the URL to reflect the new tab
    if (tab !== 'search') {
      // Use replace instead of push to avoid building up history
      router.replace(`/dashboard?tab=${tab}`);
    }
    
    // Then notify the parent about the tab change
    onTabChange(tab);
    
    // Close mobile sidebar after selection
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    
    console.log('Sidebar - Tab clicked:', tab);
  };

  const NavItem = ({ id, icon, text, description }: { 
    id: string; 
    icon: React.ReactNode; 
    text: string; 
    description?: string; 
  }) => {
    const isActive = activeTab === id;
    
    return (
      <div className="relative group mb-2">
        <button
          onClick={() => handleNavClick(id)}
          className="flex items-center w-full p-4 rounded-xl transition-all duration-300 ease-in-out relative overflow-hidden"
          style={{
            backgroundColor: isActive 
              ? 'transparent' 
              : 'transparent',
            backgroundImage: isActive 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
              : 'none',
            color: isActive 
              ? '#ffffff' 
              : (theme === 'light' ? '#374151' : '#d1d5db'),
            boxShadow: isActive 
              ? '0 4px 15px rgba(16, 185, 129, 0.25)' 
              : 'none',
            transform: isActive ? 'translateX(4px)' : 'translateX(0)',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          onMouseEnter={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : 'rgba(55, 65, 81, 0.5)';
              e.currentTarget.style.color = theme === 'light' ? '#059669' : '#34d399';
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme === 'light' ? '#374151' : '#d1d5db';
            }
          }}
        >
          {/* Active indicator line */}
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
          )}
          
          {/* Icon container */}
          <div className={`
            flex items-center justify-center min-w-[24px] h-6
            ${isActive ? 'text-white' : ''}
            ${!isCollapsed ? 'mr-4' : ''}
          `}>
            {icon}
          </div>
          
          {/* Text content */}
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <div 
                className="font-semibold text-sm"
                style={{ color: isActive ? '#ffffff' : (theme === 'light' ? '#111827' : '#ffffff') }}
              >
                {text}
              </div>
              {description && (
                <div 
                  className="text-xs mt-0.5"
                  style={{ 
                    color: isActive 
                      ? '#a7f3d0' 
                      : (theme === 'light' ? '#6b7280' : '#9ca3af') 
                  }}
                >
                  {description}
                </div>
              )}
            </div>
          )}
          
          {/* Hover effect */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-green-600/0 group-hover:from-emerald-500/5 group-hover:to-green-600/5 rounded-xl transition-all duration-300" />
          )}
        </button>
        
        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div 
            className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
            style={{
              backgroundColor: theme === 'light' ? '#111827' : '#f3f4f6',
              color: theme === 'light' ? '#ffffff' : '#111827'
            }}
          >
            {text}
            <div 
              className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent"
              style={{
                borderRightColor: theme === 'light' ? '#111827' : '#f3f4f6'
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-3 rounded-xl shadow-lg border transition-all duration-200"
        style={{
          backgroundColor: theme === 'light' ? '#ffffff' : '#374151',
          color: theme === 'light' ? '#111827' : '#ffffff',
          borderColor: theme === 'light' ? '#e5e7eb' : '#4b5563'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme === 'light' ? '#f9fafb' : '#4b5563';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = theme === 'light' ? '#ffffff' : '#374151';
        }}
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 ${mobileVisibility} md:left-0 h-full backdrop-blur-xl
          border-r transition-all duration-300 ease-in-out z-30
          ${sidebarWidth} md:${sidebarWidth}
        `}
        style={{
          backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.95)',
          borderColor: theme === 'light' ? 'rgba(229, 231, 235, 0.5)' : 'rgba(55, 65, 81, 0.5)'
        }}
      >
        {/* Header */}
        <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                    <RiDashboardFill size={24} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <div className="ml-4">
                  <h2 
                    className="text-xl font-bold"
                    style={{ color: theme === 'light' ? '#111827' : '#ffffff' }}
                  >
                    PGAGI
                  </h2>
                  <p 
                    className="text-xs font-medium"
                    style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
                  >
                    Content Dashboard
                  </p>
                </div>
              </div>
              <button
                className="p-2 rounded-lg transition-colors duration-200 hidden md:block"
                style={{
                  backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                  color: theme === 'light' ? '#6b7280' : '#9ca3af'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#e5e7eb' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#374151';
                }}
                onClick={toggleSidebar}
              >
                <FiChevronLeft size={18} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <RiDashboardFill size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <button
                className="p-2 rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: theme === 'light' ? '#f3f4f6' : '#374151',
                  color: theme === 'light' ? '#6b7280' : '#9ca3af'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#e5e7eb' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'light' ? '#f3f4f6' : '#374151';
                }}
                onClick={toggleSidebar}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={`px-4 ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="mb-6">
              <p 
                className="text-xs font-semibold uppercase tracking-wider px-4"
                style={{ color: theme === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                Navigation
              </p>
            </div>
          )}
          
          <NavItem 
            id="feed" 
            icon={<FiHome size={20} />} 
            text="Dashboard" 
            description="Overview & analytics"
          />
          <NavItem 
            id="personalized" 
            icon={<FiGrid size={20} />} 
            text="Personalized Feed" 
            description="Curated content"
          />
          <NavItem 
            id="trending" 
            icon={<FiTrendingUp size={20} />} 
            text="Trending" 
            description="Popular content"
          />
          <NavItem 
            id="favorites" 
            icon={<FiStar size={20} />} 
            text="Favorites" 
            description="Saved items"
          />
          <NavItem 
            id="search" 
            icon={<FiSearch size={20} />} 
            text="Search" 
            description="Find content"
          />
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div 
              className="rounded-xl p-4 border"
              style={{
                backgroundColor: theme === 'light' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(16, 185, 129, 0.1)',
                borderColor: theme === 'light' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)'
              }}
            >
              <div className="flex items-center text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span 
                  className="font-medium"
                  style={{ color: theme === 'light' ? '#1f2937' : '#e5e7eb' }}
                >
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Content spacer */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarWidth}`}></div>
    </>
  );
};

export default Sidebar;
