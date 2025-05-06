import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { CloudUpload, CheckCircle, ArrowBack, ArrowForward } from '@mui/icons-material';
import { GlassCard } from '../components';

// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(3),
  background: '#0A0E17',
  backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0, 240, 255, 0.1) 0%, transparent 50%)',
}));

const KYCCard = styled(GlassCard)(({ theme }) => ({
  maxWidth: 800,
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

const StyledSelect = styled(FormControl)(({ theme }) => ({
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
  '& .MuiSelect-icon': {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const UploadBox = styled(Box)(({ theme }) => ({
  border: '2px dashed rgba(0, 240, 255, 0.3)',
  borderRadius: '8px',
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  marginBottom: theme.spacing(3),
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(0, 240, 255, 0.5)',
    background: 'rgba(0, 240, 255, 0.05)',
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

// KYC steps
const steps = ['Personal Information', 'Identity Verification', 'Address Verification', 'Review'];

// Document types
const documentTypes = [
  'Passport',
  'National ID Card',
  'Driver\'s License',
];

// Countries list (abbreviated)
const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Singapore',
  'Other',
];

const KYC: React.FC = () => {
  // State for stepper
  const [activeStep, setActiveStep] = useState(0);
  
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    documentType: '',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    idDocument: null as File | null,
    addressDocument: null as File | null,
  });
  
  // State for form validation
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    country: '',
    documentType: '',
    idNumber: '',
    address: '',
    city: '',
    postalCode: '',
    idDocument: '',
    addressDocument: '',
  });
  
  // State for submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  
  // Handle form field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (!name) return;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'idDocument' | 'addressDocument') => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      });
      
      // Clear error when file is uploaded
      if (errors[field]) {
        setErrors({
          ...errors,
          [field]: '',
        });
      }
    }
  };
  
  // Validate current step
  const validateStep = (): boolean => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (activeStep === 0) {
      // Validate personal information
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
        isValid = false;
      }
      
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
        isValid = false;
      }
      
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required';
        isValid = false;
      }
      
      if (!formData.country) {
        newErrors.country = 'Country is required';
        isValid = false;
      }
    } else if (activeStep === 1) {
      // Validate identity verification
      if (!formData.documentType) {
        newErrors.documentType = 'Document type is required';
        isValid = false;
      }
      
      if (!formData.idNumber) {
        newErrors.idNumber = 'ID number is required';
        isValid = false;
      }
      
      if (!formData.idDocument) {
        newErrors.idDocument = 'ID document is required';
        isValid = false;
      }
    } else if (activeStep === 2) {
      // Validate address verification
      if (!formData.address) {
        newErrors.address = 'Address is required';
        isValid = false;
      }
      
      if (!formData.city) {
        newErrors.city = 'City is required';
        isValid = false;
      }
      
      if (!formData.postalCode) {
        newErrors.postalCode = 'Postal code is required';
        isValid = false;
      }
      
      if (!formData.addressDocument) {
        newErrors.addressDocument = 'Address document is required';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to submit KYC information. Please try again.');
      }
      
      // Success
      setIsComplete(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit KYC information');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
            </Grid>
            
            <StyledTextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
            
            <StyledSelect fullWidth required error={!!errors.country}>
              <InputLabel>Country</InputLabel>
              <Select
                name="country"
                value={formData.country}
                onChange={handleChange}
                label="Country"
              >
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>{country}</MenuItem>
                ))}
              </Select>
              {errors.country && <FormHelperText error>{errors.country}</FormHelperText>}
            </StyledSelect>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Identity Verification
            </Typography>
            
            <StyledSelect fullWidth required error={!!errors.documentType}>
              <InputLabel>Document Type</InputLabel>
              <Select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                label="Document Type"
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.documentType && <FormHelperText error>{errors.documentType}</FormHelperText>}
            </StyledSelect>
            
            <StyledTextField
              label="ID Number"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.idNumber}
              helperText={errors.idNumber}
            />
            
            <input
              type="file"
              id="id-document-upload"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'idDocument')}
            />
            
            <UploadBox
              onClick={() => document.getElementById('id-document-upload')?.click()}
              sx={{ borderColor: errors.idDocument ? 'red' : undefined }}
            >
              {formData.idDocument ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {formData.idDocument.name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: '#00F0FF', mb: 1 }} />
                  <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                    Upload ID Document
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Supported formats: JPG, PNG, PDF (max 5MB)
                  </Typography>
                </Box>
              )}
            </UploadBox>
            
            {errors.idDocument && (
              <Typography variant="caption" sx={{ color: 'red', display: 'block', mt: -2, mb: 2 }}>
                {errors.idDocument}
              </Typography>
            )}
            
            <Alert
              severity="info"
              sx={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}
            >
              Please upload a clear photo of your ID document. Make sure all information is visible and legible.
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Address Verification
            </Typography>
            
            <StyledTextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.address}
              helperText={errors.address}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.postalCode}
                  helperText={errors.postalCode}
                />
              </Grid>
            </Grid>
            
            <input
              type="file"
              id="address-document-upload"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e, 'addressDocument')}
            />
            
            <UploadBox
              onClick={() => document.getElementById('address-document-upload')?.click()}
              sx={{ borderColor: errors.addressDocument ? 'red' : undefined }}
            >
              {formData.addressDocument ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle sx={{ color: '#4CAF50', mr: 1 }} />
                  <Typography variant="body1" sx={{ color: 'white' }}>
                    {formData.addressDocument.name}
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUpload sx={{ fontSize: 48, color: '#00F0FF', mb: 1 }} />
                  <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                    Upload Proof of Address
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Supported formats: JPG, PNG, PDF (max 5MB)
                  </Typography>
                </Box>
              )}
            </UploadBox>
            
            {errors.addressDocument && (
              <Typography variant="caption" sx={{ color: 'red', display: 'block', mt: -2, mb: 2 }}>
                {errors.addressDocument}
              </Typography>
            )}
            
            <Alert
              severity="info"
              sx={{
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(0, 240, 255, 0.3)'
              }}
            >
              Please upload a utility bill, bank statement, or government-issued document that shows your name and address. The document should be less than 3 months old.
            </Alert>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Review Information
            </Typography>
            
            <Alert
              severity="warning"
              sx={{
                mb: 3,
                backgroundColor: 'rgba(255, 165, 0, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 165, 0, 0.3)'
              }}
            >
              Please review your information carefully. Once submitted, you cannot make changes.
            </Alert>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Personal Information
                  </Typography>
                  
                  <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>Name:</strong> {formData.firstName} {formData.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>Date of Birth:</strong> {formData.dateOfBirth}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>Country:</strong> {formData.country}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Identity Verification
                  </Typography>
                  
                  <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>Document Type:</strong> {formData.documentType}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>ID Number:</strong> {formData.idNumber}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>Document:</strong> {formData.idDocument?.name}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                    Address Information
                  </Typography>
                  
                  <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.05)' }}>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>Address:</strong> {formData.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>City:</strong> {formData.city}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
                      <strong>Postal Code:</strong> {formData.postalCode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      <strong>Document:</strong> {formData.addressDocument?.name}
                    </Typography>
                  </Box>
                </Box>
                
                <Alert
                  severity="info"
                  sx={{
                    backgroundColor: 'rgba(0, 240, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(0, 240, 255, 0.3)'
                  }}
                >
                  Verification typically takes 1-3 business days. You will be notified by email once your verification is complete.
                </Alert>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  // Render completion screen
  const renderCompletionScreen = () => {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(0, 255, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3
          }}
        >
          <CheckCircle sx={{ color: '#4CAF50', fontSize: 40 }} />
        </Box>
        
        <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
          Verification Submitted
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 4 }}>
          Your KYC verification has been submitted successfully. We will review your information and notify you once the verification is complete.
        </Typography>
        
        <GradientButton
          variant="contained"
          onClick={() => window.location.href = '/dashboard'}
        >
          Return to Dashboard
        </GradientButton>
      </Box>
    );
  };
  
  return (
    <PageContainer>
      <Container maxWidth="md">
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
            KYC Verification
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <KYCCard>
            {isComplete ? (
              renderCompletionScreen()
            ) : (
              <>
                <Stepper
                  activeStep={activeStep}
                  alternativeLabel
                  sx={{
                    mb: 4,
                    '& .MuiStepLabel-label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-active': {
                        color: '#00F0FF',
                      },
                      '&.Mui-completed': {
                        color: '#4CAF50',
                      },
                    },
                    '& .MuiStepIcon-root': {
                      color: 'rgba(255, 255, 255, 0.2)',
                      '&.Mui-active': {
                        color: '#00F0FF',
                      },
                      '&.Mui-completed': {
                        color: '#4CAF50',
                      },
                    },
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {getStepContent(activeStep)}
                
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
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                        background: 'rgba(255, 255, 255, 0.05)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  
                  <GradientButton
                    variant="contained"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    endIcon={activeStep === steps.length - 1 ? undefined : <ArrowForward />}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : activeStep === steps.length - 1 ? (
                      'Submit'
                    ) : (
                      'Next'
                    )}
                  </GradientButton>
                </Box>
              </>
            )}
          </KYCCard>
        </motion.div>
      </Container>
    </PageContainer>
  );
};

export default KYC;
