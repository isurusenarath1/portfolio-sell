const API_URL = 'http://localhost:5000/api/portfolio';
const CONTACT_API_URL = 'http://localhost:5000/api/contact';

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

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface Experience {
  id?: number;
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface Contact {
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  recent: number;
}

export interface ContactPagination {
  currentPage: number;
  totalPages: number;
  totalContacts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ContactResponse {
  contacts: Contact[];
  pagination: ContactPagination;
}

export interface Settings {
  tabName: string;
  tabImage: string;
  logoText: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    github: string;
    linkedin: string;
  };
}

export const getPortfolio = async () => {
  const response = await fetch(API_URL, { cache: 'no-store' });
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

export const updateSettings = async (settingsData: Partial<Settings>) => {
  const response = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ settings: settingsData }),
  });
  if (!response.ok) {
    throw new Error('Failed to update settings');
  }
  return response.json();
};

export const addEducation = async (educationData: Education) => {
  const response = await fetch(`${API_URL}/education`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error('Failed to add education');
  return response.json();
};

export const updateEducation = async (id: number, educationData: Education) => {
  const response = await fetch(`${API_URL}/education/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(educationData),
  });
  if (!response.ok) throw new Error('Failed to update education');
  return response.json();
};

export const deleteEducation = async (id: number) => {
  const response = await fetch(`${API_URL}/education/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete education');
  return response.json();
};

export const addExperience = async (experienceData: Experience) => {
  const response = await fetch(`${API_URL}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error('Failed to add experience');
  return response.json();
};

export const updateExperience = async (id: number, experienceData: Experience) => {
  const response = await fetch(`${API_URL}/experience/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(experienceData),
  });
  if (!response.ok) throw new Error('Failed to update experience');
  return response.json();
};

export const deleteExperience = async (id: number) => {
  const response = await fetch(`${API_URL}/experience/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete experience');
  return response.json();
};

export const addProject = async (projectData: Project) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to add project');
  return response.json();
};

export const updateProject = async (id: number, projectData: Project) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData),
  });
  if (!response.ok) throw new Error('Failed to update project');
  return response.json();
};

export const deleteProject = async (id: number) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete project');
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

// Contact API functions
export const getContacts = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<ContactResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.search) searchParams.append('search', params.search);

  const url = `${CONTACT_API_URL}?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch contacts');
  return response.json();
};

export const getContact = async (id: string): Promise<Contact> => {
  const response = await fetch(`${CONTACT_API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch contact');
  return response.json();
};

export const createContact = async (contactData: Omit<Contact, '_id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Contact> => {
  const response = await fetch(CONTACT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  if (!response.ok) throw new Error('Failed to create contact');
  return response.json();
};

export const updateContactStatus = async (id: string, status: Contact['status']): Promise<Contact> => {
  const response = await fetch(`${CONTACT_API_URL}/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update contact status');
  return response.json();
};

export const deleteContact = async (id: string): Promise<void> => {
  const response = await fetch(`${CONTACT_API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete contact');
};

export const getContactStats = async (): Promise<ContactStats> => {
  const response = await fetch(`${CONTACT_API_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch contact statistics');
  return response.json();
}; 