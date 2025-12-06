import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Github, 
  Linkedin, 
  Twitter,
  Zap,
  DollarSign,
  FileText,
  BookOpen,
  Building,
  MessageCircle,
  Briefcase,
  Mail,
  HelpCircle,
  FileCheck,
  Shield,
  Eye,
  Cookie,
  Lock
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HealthIndicator from '../ui/HealthIndicator';
import { getVersionInfo } from '../../utils/buildInfo';

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('Product'),
      links: [
        { name: t('Features'), href: '/features', icon: Zap },
        { name: t('Pricing'), href: '/pricing', icon: DollarSign },
        { name: t('Case Studies'), href: '/case-studies', icon: FileText },
        { name: t('Resources'), href: '/resources', icon: BookOpen },
      ],
    },
    {
      title: t('Company'),
      links: [
        { name: t('About'), href: '/about', icon: Building },
        { name: t('Blog'), href: '/blog', icon: MessageCircle },
        { name: t('Careers'), href: '#', icon: Briefcase },
        { name: t('Contact'), href: '/contact', icon: Mail },
      ],
    },
    {
      title: t('Resources'),
      links: [
        { name: t('Documentation'), href: '/documentation', icon: FileCheck },
        { name: t('Templates'), href: '/resources', icon: FileText },
        { name: t('Support'), href: '/support', icon: HelpCircle },
        { name: t('ESG Glossary'), href: '#', icon: BookOpen },
      ],
    },
    {
      title: t('Legal'),
      links: [
        { name: t('Privacy'), href: '/privacy', icon: Eye },
        { name: t('Terms'), href: '/terms', icon: FileCheck },
        { name: t('Cookie Policy'), href: '#', icon: Cookie },
        { name: t('Security'), href: '#', icon: Shield },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <img 
                src="/impactsoluce.png" 
                alt="ImpactSoluce™ Logo" 
                className="h-12 w-12 object-contain"
              />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                ImpactSoluce™ 
             <span className="block text-xs text-gray-600 dark:text-gray-400 font-normal">by ERMITS</span>
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-gray-600 dark:text-gray-400">
              {t('Transforming organizations through sustainable technology management and integrated ESG solutions for a more responsible future.')}
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label={t('Follow us on Twitter')}
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label={t('Follow us on GitHub')}
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                aria-label={t('Follow us on LinkedIn')}
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          <div className="col-span-3 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                          <IconComponent className="h-4 w-4" />
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {currentYear} {t('ESGSoluce. All rights reserved.')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getVersionInfo()}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <HealthIndicator />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('Sustainable technology for a better world')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}