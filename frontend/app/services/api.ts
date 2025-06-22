const API_URL = 'http://localhost:5000/api/portfolio';

export interface HeroSection {
  name: string;
  role: string;
  subtitle: string;
  welcomeMessage: string;
  image: string;
}

export interface Skills {
  frontend: string[];
  backend: string[];
  tools: string[];
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

export const updateSkills = async (skillsData: Skills) => {
  const response = await fetch(`${API_URL}/skills`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skillsData),
  });
  if (!response.ok) {
    throw new Error('Failed to update skills');
  }
  return response.json();
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_URL.replace('/portfolio', '')}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Upload error response:', errorData);
      throw new Error(errorData?.message || 'Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload response:', data);

    if (!data.data?.url) {
      throw new Error('No image URL received from server');
    }

    return {
      imageUrl: data.data.url
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}; 