// Centralized auth logic
export const auth = {
  logout: (navigate: any) => {
    localStorage.removeItem('token');
    navigate('/login');
  }
};