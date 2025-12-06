import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { HomeIcon } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {t('Page not found')}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('Sorry, we couldn\'t find the page you\'re looking for.')}
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button
                variant="primary"
                className="inline-flex items-center"
                icon={<HomeIcon className="w-4 h-4" />}
              >
                {t('Back to Home')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}