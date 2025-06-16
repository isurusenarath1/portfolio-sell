const API_URL = 'http://localhost:5000/api/portfolio';

export interface HeroSection {
  name: string;
  role: string;
  subtitle: string;
  welcomeMessage: string;
  image: string;
}

export const getPortfolio = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch portfolio data');
  }
  return response.json();
};

export const updateHeroSection = async (heroData: HeroSection) => {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hero: heroData }),
  });
  if (!response.ok) {
    throw new Error('Failed to update hero section');
  }
  return response.json();
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json();
}; 