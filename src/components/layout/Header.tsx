import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Leaf, 
  Menu, 
  Moon, 
  Sun, 
  X, 
  Home,
  BarChart3,
  ClipboardList,
  Map,
  Network,
  Zap,
  BookOpen,
  Settings,
  Users,
  Building,
  HelpCircle,
  FileText,
  Globe,
  Radar,
  FolderOpen
} from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/cn';
import LanguageSwitcher from '../translation/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
// Authentication disabled - import removed

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const location = useLocation();
  // Authentication is not required - always show full navigation
  const isAuthenticated = false; // Not using authentication
  const signOut = () => {}; // No-op since auth is disabled

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize dark mode on component mount
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Main navigation items - Primary nav as per plan
  const mainNavigation = [
    { name: t('Home'), href: '/', icon: Home },
    { name: t('Features'), href: '/features', icon: Zap },
    { name: t('Risk Radar'), href: '/risk-radar', icon: Radar },
    { name: t('Evidence Workspace'), href: '/evidence-workspace', icon: FolderOpen },
    { name: t('Impact Scan'), href: '/impact-scan', icon: ClipboardList },
    { name: t('Dashboard'), href: '/dashboard', icon: BarChart3 },
    { name: t('Carbon'), href: '/carbon-management', icon: Leaf },
    { name: t('Reports'), href: '/reports', icon: FileText },
    { name: t('Resources'), href: '/resources', icon: BookOpen },
    { name: t('Pricing'), href: '/pricing', icon: FileText },
    { name: t('About'), href: '/about', icon: Building },
  ];

  // Assessment & Reporting section (for dropdown)
  const assessmentNavigation = [
    { name: t('Impact Scan'), href: '/impact-scan', icon: ClipboardList },
    { name: t('Standards Mapping'), href: '/standards-mapping', icon: Map },
    { name: t('Assessment History'), href: '/assessment/history', icon: FileText },
    { name: t('Reports'), href: '/reports', icon: FileText },
  ];

  // Sustainability section (for dropdown)
  const sustainabilityNavigation = [
    { name: t('Carbon Management'), href: '/carbon-management', icon: Leaf },
    { name: t('Tech Dependencies'), href: '/tech-dependency', icon: Network },
  ];

  // Resources section (for dropdown)
  const resourcesNavigation = [
    { name: t('Resources'), href: '/resources', icon: BookOpen },
    { name: t('ESG Glossary'), href: '/esg-glossary', icon: Globe },
    { name: t('Documentation'), href: '/documentation', icon: BookOpen },
  ];

  // Company section (for mobile menu)
  const companyNavigation = [
    { name: t('About'), href: '/about', icon: Building },
    { name: t('Features'), href: '/features', icon: Zap },
    { name: t('Pricing'), href: '/pricing', icon: FileText },
    { name: t('Case Studies'), href: '/case-studies', icon: Users },
  ];

  // Support section (for mobile menu)
  const supportNavigation = [
    { name: t('Documentation'), href: '/documentation', icon: BookOpen },
    { name: t('Support'), href: '/support', icon: HelpCircle },
    { name: t('Security'), href: '/security', icon: Settings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/impactsoluce.png" 
                alt="ImpactSoluce™ Logo" 
                className="h-12 w-12 object-contain"
              />
              <div className="ml-2">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  ImpactSoluce™
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-normal leading-tight">
                  <span className="block">ESG Risk Intelligence</span>
                  <span className="block">by ERMITS</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Nav - Simplified primary navigation as per plan */}
          <nav className="hidden lg:flex space-x-1">
            {mainNavigation.slice(0, 5).map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  )}
                >
                  <IconComponent className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* More dropdown for additional items */}
            <div className="relative group">
              <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                {t('More')}
              </button>
              <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                <div className="py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  {mainNavigation.slice(5).map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 text-sm transition-colors",
                          isActive(item.href)
                            ? "text-primary bg-primary/5"
                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            
            <button
              onClick={toggleDarkMode}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={t('Toggle dark mode')}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('Account')}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                  <div className="py-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Users className="h-4 w-4" />
                      {t('Profile')}
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Settings className="h-4 w-4" />
                      {t('Settings')}
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => signOut()}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:text-red-400 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <X className="h-4 w-4" />
                      {t('Sign Out')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/signup">
                <Button
                  variant="primary"
                  className="hidden md:inline-flex bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  {t('Get Started')}
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">{t('Open main menu')}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 pt-16 transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="space-y-1 px-4 pb-4 bg-white dark:bg-gray-900 overflow-y-auto max-h-screen">
          <div className="py-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Main')}
            </h3>
            {mainNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="py-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Assessment & Reporting')}
            </h3>
            {assessmentNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="py-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Sustainability')}
            </h3>
            {sustainabilityNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="py-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Resources')}
            </h3>
            {resourcesNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="py-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Company')}
            </h3>
            {companyNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="py-2 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-3">
              {t('Support')}
            </h3>
            {supportNavigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 py-3 text-base font-medium rounded-lg px-3",
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('Theme')}
              </p>
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {t('Language')}
              </p>
              <LanguageSwitcher variant="buttons" />
            </div>
          </div>
          
          {isAuthenticated ? (
            <Button
              variant="outline"
              className="mt-4 w-full"
              onClick={() => {
                signOut();
                setIsMenuOpen(false);
              }}
            >
              {t('Sign Out')}
            </Button>
          ) : (
            <Link to="/signup" className="block w-full">
              <Button
                variant="primary"
                className="mt-4 w-full"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('Get Started')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}