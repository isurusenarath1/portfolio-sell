"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Home, User, GraduationCap, Briefcase, FolderOpen, Mail, Plus, Edit, Trash2, LogOut, Save, Search, Eye, MessageSquare, Settings as SettingsIcon } from "lucide-react"
import { getPortfolio, updateHeroSection, uploadImage, HeroSection, updateSkills, Skills as SkillsType, Education as EducationType, addEducation, updateEducation, deleteEducation, Experience as ExperienceType, addExperience, updateExperience, deleteExperience, Project as ProjectType, addProject, updateProject, deleteProject, Contact, ContactStats, getContacts, getContact, updateContactStatus, deleteContact, getContactStats, Settings, updateSettings } from "@/app/services/api"
import { toast } from "sonner"
import InteractiveBackground from "@/components/ui/interactive-background"

const initialEducationState = {
  degree: "",
  institution: "",
  year: "",
  description: "",
};

const initialExperienceState = {
  title: "",
  company: "",
  period: "",
  responsibilities: [],
};

const initialProjectState = {
  title: "",
  description: "",
  image: "",
  techStack: [],
  liveUrl: "",
  githubUrl: "",
};

const initialSettingsState: Settings = {
  tabName: "",
  tabImage: "",
  logoText: "",
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  social: {
    github: "",
    linkedin: "",
  },
  cvUrl: "",
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [heroData, setHeroData] = useState<HeroSection>({
    name: "",
    role: "",
    subtitle: "",
    welcomeMessage: "",
    image: ""
  })
  const [skills, setSkills] = useState<SkillsType>({
    frontend: [],
    backend: [],
    tools: []
  })
  const [education, setEducation] = useState<EducationType[]>([])
  const [experience, setExperience] = useState<ExperienceType[]>([])
  const [projects, setProjects] = useState<ProjectType[]>([])
  const [settings, setSettings] = useState<Settings>(initialSettingsState);
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactStats, setContactStats] = useState<ContactStats>({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    recent: 0
  })
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactFilters, setContactFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    search: ''
  })
  const [contactPagination, setContactPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth === "true") {
      setIsAuthenticated(true)
      fetchPortfolioData()
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const fetchPortfolioData = async () => {
    try {
      const data = await getPortfolio()
      if (data.hero) {
        setHeroData(data.hero)
      }
      if (data.skills) {
        setSkills(data.skills)
      }
      if (data.education) {
        setEducation(data.education)
      }
      if (data.experience) {
        setExperience(data.experience)
      }
      if (data.projects) {
        setProjects(data.projects)
      }
      if (data.settings) {
        setSettings(data.settings);
      }
      if (data.contacts) {
        setContacts(data.contacts)
      }
      if (data.contactStats) {
        setContactStats(data.contactStats)
      }
    } catch (error) {
      toast.error("Failed to fetch portfolio data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin/login")
  }

  const handleHeroChange = (field: keyof HeroSection, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    // Create preview URL
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)

    try {
      setIsLoading(true)
      setUploadProgress(0)
      
      const result = await uploadImage(file)
      if (result.imageUrl) {
        setHeroData(prev => ({
          ...prev,
          image: result.imageUrl
        }))
        toast.success("Image uploaded successfully")
      } else {
        throw new Error("No image URL received")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
      setPreviewUrl(null)
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  const handleSaveHero = async () => {
    try {
      setIsLoading(true)
      await updateHeroSection(heroData)
      toast.success("Hero section updated successfully")
    } catch (error) {
      toast.error("Failed to update hero section")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillChange = (category: keyof SkillsType, index: number, value: string) => {
    setSkills(prev => {
      const newSkills = { ...prev };
      const newCategorySkills = [...newSkills[category]];
      newCategorySkills[index] = value;
      newSkills[category] = newCategorySkills;
      return newSkills;
    });
  }

  const handleAddSkill = (category: keyof SkillsType, skill: string) => {
    if (!skill.trim()) {
      toast.error("Skill name cannot be empty")
      return
    }
    const newSkills = { ...skills }
    newSkills[category].push(skill)
    handleSaveSkills(newSkills)
  }

  const handleDeleteSkill = (category: keyof SkillsType, index: number) => {
    const newSkills = { ...skills }
    newSkills[category].splice(index, 1)
    handleSaveSkills(newSkills)
  }

  const handleSaveSkills = async (updatedSkills: SkillsType) => {
    try {
      setIsLoading(true)
      await updateSkills(updatedSkills)
      setSkills(updatedSkills);
      toast.success("Skills updated successfully")
    } catch (error) {
      toast.error("Failed to update skills")
    } finally {
      setIsLoading(false)
    }
  }

  // Education Handlers
  const handleAddEducation = async (newEducation: EducationType) => {
    try {
      const updatedEducation = await addEducation(newEducation);
      setEducation(updatedEducation);
      toast.success("Education added successfully");
    } catch (error) {
      toast.error("Failed to add education");
    }
  };

  const handleUpdateEducation = async (id: number, updatedEdu: EducationType) => {
    try {
      const updatedEducation = await updateEducation(id, updatedEdu);
      setEducation(updatedEducation);
      toast.success("Education updated successfully");
    } catch (error) {
      toast.error("Failed to update education");
    }
  };

  const handleDeleteEducation = async (id: number) => {
    try {
      const updatedEducation = await deleteEducation(id);
      setEducation(updatedEducation);
      toast.success("Education deleted successfully");
    } catch (error) {
      toast.error("Failed to delete education");
    }
  };

  // Experience Handlers
  const handleAddExperience = async (newExperience: ExperienceType) => {
    try {
      const updatedExperience = await addExperience(newExperience);
      setExperience(updatedExperience);
      toast.success("Experience added successfully");
    } catch (error) {
      toast.error("Failed to add experience");
    }
  };

  const handleUpdateExperience = async (id: number, updatedExp: ExperienceType) => {
    try {
      const updatedExperience = await updateExperience(id, updatedExp);
      setExperience(updatedExperience);
      toast.success("Experience updated successfully");
    } catch (error) {
      toast.error("Failed to update experience");
    }
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      const updatedExperience = await deleteExperience(id);
      setExperience(updatedExperience);
      toast.success("Experience deleted successfully");
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  // Project Handlers
  const handleAddProject = async (newProject: ProjectType) => {
    try {
      const updatedProjects = await addProject(newProject);
      setProjects(updatedProjects);
      toast.success("Project added successfully");
    } catch (error) {
      toast.error("Failed to add project");
    }
  };

  const handleUpdateProject = async (id: number, updatedProj: ProjectType) => {
    try {
      const updatedProjects = await updateProject(id, updatedProj);
      setProjects(updatedProjects);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      setIsLoading(true)
      await deleteProject(id)
      setProjects(prev => prev.filter(project => project.id !== id))
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  // Contact functions
  const fetchContactData = async () => {
    try {
      setIsLoading(true)
      const [contactsData, statsData] = await Promise.all([
        getContacts(contactFilters),
        getContactStats()
      ])
      setContacts(contactsData.contacts)
      setContactPagination(contactsData.pagination)
      setContactStats(statsData)
    } catch (error) {
      toast.error("Failed to fetch contact data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactStatusChange = async (id: string, status: Contact['status']) => {
    try {
      setIsLoading(true)
      await updateContactStatus(id, status)
      setContacts(prev => prev.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      ))
      toast.success("Contact status updated successfully")
    } catch (error) {
      toast.error("Failed to update contact status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      setIsLoading(true)
      await deleteContact(id)
      setContacts(prev => prev.filter(contact => contact._id !== id))
      toast.success("Contact deleted successfully")
    } catch (error) {
      toast.error("Failed to delete contact")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactFilterChange = (key: string, value: string | number) => {
    setContactFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : (typeof value === 'number' ? value : 1) // Ensure page is always a number
    }))
  }

  useEffect(() => {
    if (activeTab === 'contact') {
      fetchContactData()
    }
  }, [activeTab, contactFilters])

  // Settings Handlers
  const handleSettingsChange = (field: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleContactInfoChange = (field: keyof Settings['contact'], value: string) => {
    setSettings(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSocialChange = (field: keyof Settings['social'], value: string) => {
    setSettings(prev => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
  };

  const handleTabImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setSettings(prev => ({ ...prev, tabImage: result.imageUrl }));
      toast.success("Tab image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload tab image");
    }
  };
  
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      await updateSettings(settings);
      toast.success("Settings updated successfully");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-full lg:w-64 bg-black/20 backdrop-blur-md border-r border-white/10 min-h-screen lg:fixed lg:left-0 lg:top-0"
        >
          <div className="p-4 lg:p-6">
            <h2 className="text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8">Admin Panel</h2>
            <nav className="space-y-2">
              {[
                { id: "home", label: "Home", icon: Home },
                { id: "skills", label: "Skills", icon: User },
                { id: "education", label: "Education", icon: GraduationCap },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "projects", label: "Projects", icon: FolderOpen },
                { id: "contact", label: "Contact", icon: Mail },
                { id: "settings", label: "Settings", icon: SettingsIcon },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 5 }}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors text-sm lg:text-base ${
                    activeTab === item.id
                      ? "bg-purple-600/30 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-4 lg:bottom-6 left-4 lg:left-6 right-4 lg:right-6">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 lg:py-3"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-4 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-white/70">Manage your portfolio content</p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Home Management */}
            <TabsContent value="home">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Hero Section</CardTitle>
                    <CardDescription className="text-white/70">Update your hero section content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Name</Label>
                        <Input 
                          value={heroData.name}
                          onChange={(e) => handleHeroChange("name", e.target.value)}
                          className="bg-white/5 border-white/20 text-white" 
                        />
                      </div>
                      <div>
                        <Label className="text-white">Role</Label>
                        <Input
                          value={heroData.role}
                          onChange={(e) => handleHeroChange("role", e.target.value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Subtitle</Label>
                      <Input
                        value={heroData.subtitle}
                        onChange={(e) => handleHeroChange("subtitle", e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Welcome Message</Label>
                      <Textarea
                        value={heroData.welcomeMessage}
                        onChange={(e) => handleHeroChange("welcomeMessage", e.target.value)}
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white">Hero Image</Label>
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isLoading}
                            className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                          />
                          <p className="text-white/60 text-sm">Upload a new hero image (recommended: 400x400px, max 5MB)</p>
                        </div>

                        {/* Image Preview Section */}
                        <div className="relative">
                          {(previewUrl || heroData.image) && (
                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-purple-500/50">
                              <Image 
                                src={previewUrl || heroData.image} 
                                alt="Hero preview" 
                                fill
                                className="object-cover"
                              />
                              {isLoading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Upload Progress */}
                        {isLoading && uploadProgress > 0 && (
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={handleSaveHero}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Skills Management */}
            <TabsContent value="skills">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Skills Management</h2>
                  <AddSkillDialog onAddSkill={handleAddSkill} />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {(Object.keys(skills) as Array<keyof SkillsType>).map((category) => (
                    <Card key={category} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-white capitalize">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {skills[category].map((skill, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                                {skill}
                              </Badge>
                              <div className="flex space-x-1">
                                <EditSkillDialog
                                  skill={skill}
                                  category={category}
                                  onUpdateSkill={(value) => {
                                    const newSkills = { ...skills };
                                    newSkills[category][index] = value;
                                    handleSaveSkills(newSkills);
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDeleteSkill(category, index)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Education Management */}
            <TabsContent value="education">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Education Management</h2>
                  <EducationDialog onSave={handleAddEducation} />
                </div>

                <div className="space-y-4">
                  {education.map((edu) => (
                    <Card key={edu.id} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{edu.degree}</CardTitle>
                            <CardDescription className="text-white/70">
                              {edu.institution} • {edu.year}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <EducationDialog education={edu} onSave={(updatedEdu) => handleUpdateEducation(edu.id!, updatedEdu)} />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteEducation(edu.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80">{edu.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Experience Management */}
            <TabsContent value="experience">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Experience Management</h2>
                  <ExperienceDialog onSave={handleAddExperience} />
                </div>

                <div className="space-y-4">
                  {experience.map((exp) => (
                    <Card key={exp.id} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{exp.title}</CardTitle>
                            <CardDescription className="text-white/70">
                              {exp.company} • {exp.period}
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <ExperienceDialog experience={exp} onSave={(updatedExp) => handleUpdateExperience(exp.id!, updatedExp)} />
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteExperience(exp.id!)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-white/80 space-y-1">
                          {exp.responsibilities.map((resp, i) => (
                            <li key={i}>• {resp}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Projects Management */}
            <TabsContent value="projects">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">Projects Management</h2>
                  <ProjectDialog onSave={handleAddProject} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <div className="relative">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          width={400}
                          height={200}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <ProjectDialog project={project} onSave={(updatedProj) => handleUpdateProject(project.id!, updatedProj)} />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 bg-black/20"
                            onClick={() => handleDeleteProject(project.id!)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/70 text-sm mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech, i) => (
                            <Badge key={i} variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            {/* Contact Management */}
            <TabsContent value="contact">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
                  
                  {/* Contact Stats */}
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-white">{contactStats.total}</div>
                      <div className="text-white/70 text-sm">Total</div>
                    </div>
                    <div className="bg-red-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-red-400">{contactStats.unread}</div>
                      <div className="text-white/70 text-sm">Unread</div>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">{contactStats.read}</div>
                      <div className="text-white/70 text-sm">Read</div>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-400">{contactStats.replied}</div>
                      <div className="text-white/70 text-sm">Replied</div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-white">Search</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                          <Input
                            placeholder="Search contacts..."
                            value={contactFilters.search}
                            onChange={(e) => handleContactFilterChange('search', e.target.value)}
                            className="bg-white/5 border-white/20 text-white pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white">Status</Label>
                        <select
                          value={contactFilters.status}
                          onChange={(e) => handleContactFilterChange('status', e.target.value)}
                          className="w-full bg-white/5 border border-white/20 text-white rounded-md p-2 mt-1"
                        >
                          <option value="" className="text-black">All Status</option>
                          <option value="unread" className="text-black">Unread</option>
                          <option value="read" className="text-black">Read</option>
                          <option value="replied" className="text-black">Replied</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-white">Per Page</Label>
                        <select
                          value={contactFilters.limit}
                          onChange={(e) => handleContactFilterChange('limit', parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/20 text-white rounded-md p-2 mt-1"
                        >
                          <option value={5} className="text-black">5 per page</option>
                          <option value={10} className="text-black">10 per page</option>
                          <option value={20} className="text-black">20 per page</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact List */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : contacts.length === 0 ? (
                    <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardContent className="pt-6 text-center">
                        <MessageSquare className="w-12 h-12 text-white/50 mx-auto mb-4" />
                        <p className="text-white/70">No contacts found</p>
                      </CardContent>
                    </Card>
                  ) : (
                    contacts.map((contact) => (
                      <Card key={contact._id} className="bg-white/10 border-white/20 backdrop-blur-md">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-white">{contact.name}</CardTitle>
                                <Badge 
                                  variant={contact.status === 'unread' ? 'destructive' : contact.status === 'read' ? 'secondary' : 'default'}
                                  className={contact.status === 'unread' ? 'bg-red-500/20 text-red-400' : contact.status === 'read' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}
                                >
                                  {contact.status}
                                </Badge>
                              </div>
                              <CardDescription className="text-white/70">
                                {contact.email} • {new Date(contact.createdAt!).toLocaleDateString()} {new Date(contact.createdAt!).toLocaleTimeString()}
                              </CardDescription>
                              <div className="mt-2">
                                <span className="text-white/80 font-medium">Subject: </span>
                                <span className="text-white/70">{contact.subject}</span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => setSelectedContact(contact)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteContact(contact._id!)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white/80 line-clamp-2">{contact.message}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {contactPagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!contactPagination.hasPrevPage}
                      onClick={() => handleContactFilterChange('page', contactPagination.currentPage - 1)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Previous
                    </Button>
                    <span className="text-white/70">
                      Page {contactPagination.currentPage} of {contactPagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!contactPagination.hasNextPage}
                      onClick={() => handleContactFilterChange('page', contactPagination.currentPage + 1)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Settings Management */}
            <TabsContent value="settings">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">General Settings</CardTitle>
                    <CardDescription className="text-white/70">Manage your portfolio's global settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Tab Name</Label>
                        <Input 
                          value={settings.tabName}
                          onChange={(e) => handleSettingsChange("tabName", e.target.value)}
                          className="bg-white/5 border-white/20 text-white" 
                        />
                      </div>
                      <div>
                        <Label className="text-white">Text Logo</Label>
                        <Input
                          value={settings.logoText}
                          onChange={(e) => handleSettingsChange("logoText", e.target.value)}
                          className="bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">Tab Image (Favicon)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleTabImageUpload}
                          className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                        />
                        {settings.tabImage && <Image src={settings.tabImage} alt="Tab preview" width={32} height={32} className="rounded" />}
                      </div>
                    </div>
                    <div>
                      <Label className="text-white">CV Link (Google Drive)</Label>
                      <Input
                        value={settings.cvUrl}
                        onChange={(e) => handleSettingsChange("cvUrl", e.target.value)}
                        placeholder="Paste your shareable Google Drive link here"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <Input 
                        value={settings.contact.email}
                        onChange={(e) => handleContactInfoChange("email", e.target.value)}
                        placeholder="Email"
                        className="bg-white/5 border-white/20 text-white" 
                      />
                      <Input
                        value={settings.contact.phone}
                        onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                        placeholder="Phone"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <Input
                      value={settings.contact.address}
                      onChange={(e) => handleContactInfoChange("address", e.target.value)}
                      placeholder="Address"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="text-white">Social Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input 
                      value={settings.social.github}
                      onChange={(e) => handleSocialChange("github", e.target.value)}
                      placeholder="GitHub URL"
                      className="bg-white/5 border-white/20 text-white" 
                    />
                    <Input
                      value={settings.social.linkedin}
                      onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                      placeholder="LinkedIn URL"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </CardContent>
                </Card>
                
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Contact Detail Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Name</Label>
                  <p className="text-white/80 mt-1">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-white">Email</Label>
                  <p className="text-white/80 mt-1">{selectedContact.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-white">Subject</Label>
                <p className="text-white/80 mt-1">{selectedContact.subject}</p>
              </div>
              <div>
                <Label className="text-white">Date</Label>
                <p className="text-white/80 mt-1">
                  {new Date(selectedContact.createdAt!).toLocaleDateString()} at {new Date(selectedContact.createdAt!).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <Label className="text-white">Status</Label>
                <select
                  value={selectedContact.status}
                  onChange={(e) => handleContactStatusChange(selectedContact._id!, e.target.value as Contact['status'])}
                  className="w-full bg-white/5 border border-white/20 text-white rounded-md p-2 mt-1"
                >
                  <option value="unread" className="text-black">Unread</option>
                  <option value="read" className="text-black">Read</option>
                  <option value="replied" className="text-black">Replied</option>
                </select>
              </div>
              <div>
                <Label className="text-white">Message</Label>
                <div className="bg-white/5 border border-white/20 rounded-md p-3 mt-1">
                  <p className="text-white/80 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedContact(null)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteContact(selectedContact._id!);
                    setSelectedContact(null);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddSkillDialog({ onAddSkill }: { onAddSkill: (category: keyof SkillsType, skill: string) => void }) {
  const [category, setCategory] = useState<keyof SkillsType>("frontend")
  const [skill, setSkill] = useState("")
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    onAddSkill(category, skill)
    setSkill("")
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-white">Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as keyof SkillsType)}
              className="w-full bg-white/5 border border-white/20 text-white rounded-md p-2 mt-1"
            >
              <option value="frontend" className="text-black">Frontend</option>
              <option value="backend" className="text-black">Backend</option>
              <option value="tools" className="text-black">Tools</option>
            </select>
          </div>
          <div>
            <Label className="text-white">Skill Name</Label>
            <Input
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              placeholder="e.g. React, Node.js, etc."
            />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditSkillDialog({
  skill,
  category,
  onUpdateSkill,
}: {
  skill: string
  category: keyof SkillsType
  onUpdateSkill: (value: string) => void
}) {
  const [newSkill, setNewSkill] = useState(skill)
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onUpdateSkill(newSkill);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
          <Edit className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-white">Category</Label>
            <Input readOnly value={category} className="bg-white/10 border-white/20 text-white/70 capitalize" />
          </div>
          <div>
            <Label className="text-white">Skill Name</Label>
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
            />
          </div>
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EducationDialog({
  education,
  onSave,
}: {
  education?: EducationType;
  onSave: (data: EducationType) => void;
}) {
  const [eduData, setEduData] = useState(education || initialEducationState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(eduData);
    setIsOpen(false);
    if (!education) {
      setEduData(initialEducationState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {education ? (
          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{education ? "Edit" : "Add"} Education</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-white">Degree/Certificate</Label>
            <Input
              value={eduData.degree}
              onChange={(e) => setEduData({ ...eduData, degree: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Bachelor of Computer Science"
            />
          </div>
          <div>
            <Label className="text-white">Institution</Label>
            <Input
              value={eduData.institution}
              onChange={(e) => setEduData({ ...eduData, institution: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="University of Technology"
            />
          </div>
          <div>
            <Label className="text-white">Year</Label>
            <Input
              value={eduData.year}
              onChange={(e) => setEduData({ ...eduData, year: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="2020-2024"
            />
          </div>
          <div>
            <Label className="text-white">Description</Label>
            <Textarea
              value={eduData.description}
              onChange={(e) => setEduData({ ...eduData, description: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Specialized in Software Engineering and Web Development"
              rows={3}
            />
          </div>
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {education ? "Save Changes" : "Add Education"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExperienceDialog({
  experience,
  onSave,
}: {
  experience?: ExperienceType;
  onSave: (data: ExperienceType) => void;
}) {
  const [expData, setExpData] = useState(experience || initialExperienceState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(expData);
    setIsOpen(false);
    if (!experience) {
      setExpData(initialExperienceState);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {experience ? (
          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
            <Edit className="w-4 h-4" />
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{experience ? "Edit" : "Add"} Experience</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label className="text-white">Job Title</Label>
            <Input
              value={expData.title}
              onChange={(e) => setExpData({ ...expData, title: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Senior Frontend Developer"
            />
          </div>
          <div>
            <Label className="text-white">Company</Label>
            <Input
              value={expData.company}
              onChange={(e) => setExpData({ ...expData, company: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="Tech Solutions Inc."
            />
          </div>
          <div>
            <Label className="text-white">Period</Label>
            <Input
              value={expData.period}
              onChange={(e) => setExpData({ ...expData, period: e.target.value })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="2023 - Present"
            />
          </div>
          <div>
            <Label className="text-white">Responsibilities</Label>
            <Textarea
              value={expData.responsibilities.join("\n")}
              onChange={(e) => setExpData({ ...expData, responsibilities: e.target.value.split("\n") })}
              className="bg-white/5 border-white/20 text-white"
              placeholder="• Led development of responsive web applications..."
              rows={5}
            />
            <p className="text-white/60 text-sm mt-1">
              Add one responsibility per line.
            </p>
          </div>
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            {experience ? "Save Changes" : "Add Experience"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProjectDialog({
  project,
  onSave,
}: {
  project?: ProjectType;
  onSave: (data: ProjectType) => void;
}) {
  const [projData, setProjData] = useState(project || initialProjectState);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = async () => {
    onSave(projData);
    setIsOpen(false);
    if (!project) {
      setProjData(initialProjectState);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return;
    try {
      const result = await uploadImage(file);
      setProjData(prev => ({ ...prev, image: result.imageUrl }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {project ? (
          <Button size="sm" variant="ghost" className="text-white/70 hover:text-white bg-black/20">
            <Edit className="w-3 h-3" />
          </Button>
        ) : (
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{project ? "Edit" : "Add"} Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Input
            value={projData.title}
            onChange={(e) => setProjData({ ...projData, title: e.target.value })}
            placeholder="Project Title"
            className="bg-white/5 border-white/20 text-white"
          />
          <Textarea
            value={projData.description}
            onChange={(e) => setProjData({ ...projData, description: e.target.value })}
            placeholder="Project Description"
            className="bg-white/5 border-white/20 text-white"
          />
          <Input
            value={projData.techStack.join(", ")}
            onChange={(e) => setProjData({ ...projData, techStack: e.target.value.split(",").map(s => s.trim()) })}
            placeholder="Tech Stack (comma-separated)"
            className="bg-white/5 border-white/20 text-white"
          />
          <Input
            value={projData.liveUrl}
            onChange={(e) => setProjData({ ...projData, liveUrl: e.target.value })}
            placeholder="Live URL"
            className="bg-white/5 border-white/20 text-white"
          />
          <Input
            value={projData.githubUrl}
            onChange={(e) => setProjData({ ...projData, githubUrl: e.target.value })}
            placeholder="GitHub URL"
            className="bg-white/5 border-white/20 text-white"
          />
          <div>
            <Label className="text-white">Project Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
            />
            {projData.image && <Image src={projData.image} alt="Project preview" width={100} height={100} className="mt-2 rounded" />}
          </div>
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            {project ? "Save Changes" : "Add Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
