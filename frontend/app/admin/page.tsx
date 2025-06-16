"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Home, User, GraduationCap, Briefcase, FolderOpen, Mail, Plus, Edit, Trash2, LogOut, Save } from "lucide-react"
import { getPortfolio, updateHeroSection, uploadImage, HeroSection } from "@/app/services/api"
import { toast } from "sonner"

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
  const [isLoading, setIsLoading] = useState(false)
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
    } catch (error) {
      toast.error("Failed to fetch portfolio data")
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

    try {
      setIsLoading(true)
      const result = await uploadImage(file)
      setHeroData(prev => ({
        ...prev,
        image: result.imageUrl
      }))
      toast.success("Image uploaded successfully")
    } catch (error) {
      toast.error("Failed to upload image")
    } finally {
      setIsLoading(false)
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
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isLoading}
                          className="bg-white/5 border-white/20 text-white file:bg-purple-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
                        />
                        <p className="text-white/60 text-sm">Upload a new hero image (recommended: 400x400px)</p>
                        {heroData.image && (
                          <div className="mt-2">
                            <img 
                              src={heroData.image} 
                              alt="Hero preview" 
                              className="w-32 h-32 object-cover rounded-lg"
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
                  <Dialog>
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
                          <select className="w-full bg-white/5 border border-white/20 text-white rounded-md p-2 mt-1">
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="tools">Tools</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-white">Skill Name</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="e.g. React, Node.js, etc."
                          />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Skill
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {["Frontend", "Backend", "Tools"].map((category) => (
                    <Card key={category} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <CardTitle className="text-white">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {["React", "Next.js", "TypeScript"].map((skill) => (
                            <div key={skill} className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                                {skill}
                              </Badge>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add Education</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="text-white">Degree/Certificate</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="Bachelor of Computer Science"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Institution</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="University of Technology"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Start Year</Label>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="2020" />
                          </div>
                          <div>
                            <Label className="text-white">End Year</Label>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="2024" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Description</Label>
                          <Textarea
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="Specialized in Software Engineering and Web Development"
                            rows={3}
                          />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Education
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <Card key={item} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">Bachelor of Computer Science</CardTitle>
                            <CardDescription className="text-white/70">
                              University of Technology • 2020-2024
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80">Specialized in Software Engineering and Web Development</p>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Experience
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-white">Add Experience</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-2">
                        <div>
                          <Label className="text-white">Job Title</Label>
                          <Input
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="Senior Frontend Developer"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Company</Label>
                          <Input className="bg-white/5 border-white/20 text-white" placeholder="Tech Solutions Inc." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Start Date</Label>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="2023" />
                          </div>
                          <div>
                            <Label className="text-white">End Date</Label>
                            <Input className="bg-white/5 border-white/20 text-white" placeholder="Present" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-white">Responsibilities</Label>
                          <Textarea
                            className="bg-white/5 border-white/20 text-white"
                            placeholder="• Led development of responsive web applications
• Implemented modern UI/UX designs
• Collaborated with cross-functional teams"
                            rows={5}
                          />
                          <p className="text-white/60 text-sm mt-1">
                            Add one responsibility per line with bullet points (•)
                          </p>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Experience
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {[1, 2].map((item) => (
                    <Card key={item} className="bg-white/10 border-white/20 backdrop-blur-md">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">Senior Frontend Developer</CardTitle>
                            <CardDescription className="text-white/70">
                              Tech Solutions Inc. • 2023 - Present
                            </CardDescription>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-white/80 space-y-1">
                          <li>• Led development of responsive web applications</li>
                          <li>• Implemented modern UI/UX designs</li>
                          <li>• Collaborated with cross-functional teams</li>
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
