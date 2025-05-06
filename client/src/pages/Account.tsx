import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Avatar,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  Person,
  Security,
  Notifications,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  CloudUpload
} from '@mui/icons-material';
import { GlassCard } from '../components';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: '#0A0E17',
  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
}));

const AccountCard = styled(GlassCard)(({ theme }) => ({
  maxWidth: 900,
  margin: '0 auto',
  padding: theme.spacing(4),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 240, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(0, 240, 255, 0.5)',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
      color: '#00F0FF',
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
  color: 'white',
  fontWeight: 600,
  padding: '10px 20px',
  borderRadius: '8px',
  '&:hover': {
    background: 'linear-gradient(135deg, #00E0F0, #0090E0)',
  },
  '&.Mui-disabled': {
    background: 'rgba(0, 240, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#00F0FF',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: '3px solid rgba(0, 240, 255, 0.3)',
  boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)',
  margin: '0 auto 20px auto',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Account: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  
  // State for profile form
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: null as File | null,
  });
  
  // State for security form
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
  });
  
  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    marketAlerts: true,
    securityAlerts: true,
    promotionalEmails: false,
  });
  
  // State for form editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };
  
  // Handle security form change
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value,
    });
  };
  
  // Handle notification settings change
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  // Handle profile image upload
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData({
        ...profileData,
        profileImage: e.target.files[0],
      });
    }
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to update profile. Please try again.');
      }
      
      // Success
      setSubmitSuccess(true);
      setIsEditingProfile(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle security form submission
  const handleSecuritySubmit = async () => {
    // Validate passwords
    if (securityData.newPassword !== securityData.confirmPassword) {
      setSubmitError('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to update security settings. Please try again.');
      }
      
      // Success
      setSubmitSuccess(true);
      setSecurityData({
        ...securityData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update security settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle notification settings submission
  const handleNotificationSubmit = async () => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to update notification settings. Please try again.');
      }
      
      // Success
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to update notification settings');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageContainer>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #00F0FF, #00A3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Account Settings
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AccountCard>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                mb: 3,
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00F0FF',
                },
              }}
            >
              <StyledTab icon={<Person />} label="Profile" />
              <StyledTab icon={<Security />} label="Security" />
              <StyledTab icon={<Notifications />} label="Notifications" />
            </Tabs>
            
            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <input
                  type="file"
                  id="profile-image-upload"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProfileImageUpload}
                  disabled={!isEditingProfile}
                />
                
                <Box sx={{ position: 'relative', display: 'inline-block' }}>
                  <ProfileAvatar src={profileData.profileImage ? URL.createObjectURL(profileData.profileImage) : '/avatar-placeholder.png'} />
                  
                  {isEditingProfile && (
                    <IconButton
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 240, 255, 0.2)',
                        border: '1px solid rgba(0, 240, 255, 0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(0, 240, 255, 0.3)',
                        }
                      }}
                    >
                      <Edit sx={{ fontSize: 16, color: 'white' }} />
                    </IconButton>
                  )}
                </Box>
                
                <Typography variant="h6" sx={{ color: 'white', mt: 2 }}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {profileData.email}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                {isEditingProfile ? (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setIsEditingProfile(false)}
                      sx={{
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                          background: 'rgba(255, 255, 255, 0.05)'
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    
                    <GradientButton
                      variant="contained"
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleProfileSubmit}
                      disabled={isSubmitting}
                    >
                      Save Changes
                    </GradientButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<Edit />}
                    onClick={() => setIsEditingProfile(true)}
                    sx={{
                      borderColor: 'rgba(0, 240, 255, 0.3)',
                      color: '#00F0FF',
                      '&:hover': {
                        borderColor: 'rgba(0, 240, 255, 0.5)',
                        background: 'rgba(0, 240, 255, 0.05)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="First Name"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Last Name"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <StyledTextField
                    label="Phone Number"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    fullWidth
                    disabled={!isEditingProfile}
                  />
                </Grid>
              </Grid>
              
              {submitSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 255, 0, 0.3)'
                  }}
                >
                  Profile updated successfully!
                </Alert>
              )}
              
              {submitError && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 0, 0, 0.3)'
                  }}
                >
                  {submitError}
                </Alert>
              )}
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  Change Password
                </Typography>
                
                <StyledTextField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                
                <StyledTextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                
                <StyledTextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                  fullWidth
                />
                
                <GradientButton
                  variant="contained"
                  onClick={handleSecuritySubmit}
                  disabled={isSubmitting || !securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update Password'}
                </GradientButton>
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 4 }} />
              
              <Box>
                <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                  Two-Factor Authentication
                </Typography>
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={securityData.twoFactorEnabled}
                      onChange={(e) => setSecurityData({ ...securityData, twoFactorEnabled: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Enable Two-Factor Authentication"
                  sx={{ color: 'white', mb: 2 }}
                />
                
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3 }}>
                  Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to provide a verification code from your mobile device in addition to your password when logging in.
                </Typography>
                
                <Button
                  variant="outlined"
                  disabled={!securityData.twoFactorEnabled}
                  sx={{
                    borderColor: 'rgba(0, 240, 255, 0.3)',
                    color: '#00F0FF',
                    '&:hover': {
                      borderColor: 'rgba(0, 240, 255, 0.5)',
                      background: 'rgba(0, 240, 255, 0.05)'
                    },
                    '&.Mui-disabled': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Setup Two-Factor Authentication
                </Button>
              </Box>
              
              {submitSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 255, 0, 0.3)'
                  }}
                >
                  Security settings updated successfully!
                </Alert>
              )}
              
              {submitError && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 0, 0, 0.3)'
                  }}
                >
                  {submitError}
                </Alert>
              )}
            </TabPanel>
            
            {/* Notifications Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ color: 'white', mb: 3 }}>
                Notification Settings
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                      name="emailNotifications"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Email Notifications"
                  sx={{ color: 'white', display: 'block', mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={handleNotificationChange}
                      name="pushNotifications"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Push Notifications"
                  sx={{ color: 'white', display: 'block', mb: 2 }}
                />
              </Box>
              
              <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
                Notification Types
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.marketAlerts}
                      onChange={handleNotificationChange}
                      name="marketAlerts"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Market Alerts"
                  sx={{ color: 'white', display: 'block', mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.securityAlerts}
                      onChange={handleNotificationChange}
                      name="securityAlerts"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Security Alerts"
                  sx={{ color: 'white', display: 'block', mb: 2 }}
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.promotionalEmails}
                      onChange={handleNotificationChange}
                      name="promotionalEmails"
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#00F0FF',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'rgba(0, 240, 255, 0.5)',
                        },
                      }}
                    />
                  }
                  label="Promotional Emails"
                  sx={{ color: 'white', display: 'block', mb: 2 }}
                />
              </Box>
              
              <GradientButton
                variant="contained"
                onClick={handleNotificationSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Notification Settings'}
              </GradientButton>
              
              {submitSuccess && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 255, 0, 0.3)'
                  }}
                >
                  Notification settings updated successfully!
                </Alert>
              )}
              
              {submitError && (
                <Alert
                  severity="error"
                  sx={{
                    mt: 3,
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 0, 0, 0.3)'
                  }}
                >
                  {submitError}
                </Alert>
              )}
            </TabPanel>
          </AccountCard>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default Account;
