import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { 
  User, 
  Mail, 
  Building, 
  Shield, 
  Key, 
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile, isLoading } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        email: user.email || '',
        company: user.user_metadata?.company || '',
        jobTitle: user.user_metadata?.job_title || '',
        phone: user.user_metadata?.phone || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        job_title: formData.jobTitle,
        phone: formData.phone,
      });
      
      setIsEditing(false);
      addToast('success', t('Profile updated successfully'));
    } catch (error) {
      console.error('Error updating profile:', error);
      addToast('error', t('Failed to update profile'), error instanceof Error ? error.message : '');
    }
  };
  
  // Mock activity data
  const recentActivity = [
    {
      type: 'assessment',
      title: t('Completed ESG Assessment'),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      icon: CheckCircle2,
    },
    {
      type: 'login',
      title: t('Logged in from new device'),
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      icon: Shield,
    },
    {
      type: 'report',
      title: t('Generated Carbon Report'),
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      icon: FileText,
    },
  ];

  return (
    <Layout title={t('Profile')} description={t('Manage your account settings and preferences')}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {t('Profile')}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {t('Manage your account information and preferences')}
            </p>
          </div>
          {!isEditing && (
            <Button
              className="mt-4 md:mt-0 bg-primary"
              onClick={() => setIsEditing(true)}
            >
              {t('Edit Profile')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t('Profile Information')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('First Name')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Last Name')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Email Address')}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          disabled={true}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 cursor-not-allowed dark:text-white"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t('Email cannot be changed. Contact support for assistance.')}
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Company')}
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Job Title')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="jobTitle"
                          name="jobTitle"
                          type="text"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('Phone Number')}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isLoading}
                      >
                        {t('Cancel')}
                      </Button>
                      <Button
                        type="submit"
                        className="bg-primary"
                        icon={<Save className="h-4 w-4" />}
                        loading={isLoading}
                        disabled={isLoading}
                      >
                        {t('Save Changes')}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
            
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('Security')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('Password')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {t('Secure your account with a strong password')}
                    </p>
                    <div className="space-y-4">
                      <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Current Password')}
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder={t('Enter current password')}
                        />
                      </div>
                      <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('New Password')}
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder={t('Enter new password')}
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {t('Password must be at least 8 characters with uppercase, lowercase, and numbers')}
                        </p>
                      </div>
                      <div className="max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('Confirm New Password')}
                        </label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder={t('Confirm new password')}
                        />
                      </div>
                      <Button
                        variant="outline"
                        icon={<Key className="h-4 w-4" />}
                        onClick={() => {
                          addToast('success', t('Password change functionality is ready. In production, this would update your password securely.'));
                        }}
                      >
                        {t('Update Password')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t('Two-Factor Authentication')}
                    </h3>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                        <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {t('Two-factor authentication is not enabled yet. Enable it for additional security.')}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="enable2FA"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="enable2FA" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {t('Enable Two-Factor Authentication')}
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('When enabled, you will need to enter a code from your authenticator app in addition to your password when signing in.')}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            addToast('success', t('2FA setup initiated. In production, this would guide you through the setup process with QR code.'));
                          }}
                        >
                          {t('Set Up 2FA')}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            addToast('info', t('You can use apps like Google Authenticator, Authy, or Microsoft Authenticator.'));
                          }}
                        >
                          {t('Learn More')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {t('Recent Activity')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-primary"
                  >
                    {t('View All Activity')}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t('Account Summary')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('Account Type')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{t('Professional')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('Member Since')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user?.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('Last Login')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(user?.last_sign_in_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('Assessments')}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link to="/pricing">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {t('Manage Subscription')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}