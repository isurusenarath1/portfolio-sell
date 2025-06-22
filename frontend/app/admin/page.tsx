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
import { Home, User, GraduationCap, Briefcase, FolderOpen, Mail, Plus, Edit, Trash2, LogOut, Save } from "lucide-react"
import { getPortfolio, updateHeroSection, uploadImage, HeroSection, updateSkills, Skills as SkillsType, Education as EducationType, addEducation, updateEducation, deleteEducation, Experience as ExperienceType, addExperience, updateExperience, deleteExperience } from "@/app/services/api"
import { toast } from "sonner"

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
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Project
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add New Project</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Project Title</Label>
                            <Input
                              className="bg-white/5 border-white/20 text-white"
                              placeholder="Enter project title"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Live URL</Label>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="https://..." />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">GitHub URL</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="https://github.com/..."
                          />
                        </div>
                        <div>
                          <Label className="text-white">Description</Label>
                          <Textarea
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="Describe your project..."
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label className="text-white">Tech Stack (comma separated)</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="React, Next.js, TypeScript..."
                          />
                        </div>
                        <div>
                          <Label className="text-white">Project Image</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                          />
                          <p className="text-white/60 text-sm mt-1">
                            Upload project thumbnail (recommended: 400x300px)
                          </p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <div className="relative">
                        <div className="w-full h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-t-lg"></div>
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-white/70 hover:text-white bg-black/20">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-slate-900 border-white/20 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Edit Project</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-white">Project Title</Label>
                                  <Input
                                    defaultValue="E-Commerce Platform"
                                    className="bg-white/5 border-white/20 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white">Update Image</Label>
                                  <Input
                                    type="file"
                                    accept="image/*"
                                    className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                                  />
                                </div>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                                  Update Project
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 bg-black/20">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white text-lg">E-Commerce Platform</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/70 text-sm mb-3">A modern e-commerce platform built with Next.js</p>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                            Next.js
                          </Badge>
                          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
                            TypeScript
                          </Badge>
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
                <h2 className="text-2xl font-bold text-white">Contact Messages</h2>

                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">John Smith</CardTitle>
                            <CardDescription className="text-white/70">
                              john.smith@example.com • 2 hours ago
                            </CardDescription>
                          </div>
                          <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80">
                          Hi! I'm interested in discussing a potential project collaboration. Would you be available for
                          a call next week?
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
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
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
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
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="tools">Tools</option>
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
          <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
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
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
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
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
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
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
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
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
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
          <Button onClick={handleSave} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            {experience ? "Save Changes" : "Add Experience"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
