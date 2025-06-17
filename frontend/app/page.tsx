"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  ExternalLink,
  Calendar,
  Building,
  GraduationCap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { getPortfolio } from "@/app/services/api"

// Mock data for other sections - in real app this would come from API/database
const portfolioData = {
  skills: {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    backend: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
    tools: ["Git", "Docker", "AWS", "Figma", "VS Code"],
  },
  education: [
    {
      id: 1,
      degree: "Bachelor of Computer Science",
      institution: "University of Technology",
      year: "2020-2024",
      description: "Specialized in Software Engineering and Web Development",
    },
    {
      id: 2,
      degree: "Full Stack Web Development Bootcamp",
      institution: "Tech Academy",
      year: "2023",
      description: "Intensive program covering modern web technologies",
    },
  ],
  experience: [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Solutions Inc.",
      period: "2023 - Present",
      responsibilities: [
        "Led development of responsive web applications using React and Next.js",
        "Implemented modern UI/UX designs with Tailwind CSS",
        "Collaborated with cross-functional teams to deliver high-quality products",
      ],
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Digital Agency",
      period: "2022 - 2023",
      responsibilities: [
        "Developed interactive websites for various clients",
        "Optimized application performance and user experience",
        "Mentored junior developers and conducted code reviews",
      ],
    },
  ],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A modern e-commerce platform built with Next.js, featuring real-time inventory management and secure payment processing.",
      image: "/placeholder.svg?height=300&width=400",
      techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 2,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image: "/placeholder.svg?height=300&width=400",
      techStack: ["React", "Node.js", "Socket.io", "MongoDB"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description:
        "A beautiful weather dashboard with interactive charts, location-based forecasts, and responsive design.",
      image: "/placeholder.svg?height=300&width=400",
      techStack: ["React", "Chart.js", "OpenWeather API", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ],
}

export default function Portfolio() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const [selectedProject, setSelectedProject] = useState(null)
  const [heroData, setHeroData] = useState({
    name: "",
    role: "",
    subtitle: "",
    welcomeMessage: "",
    image: "/placeholder.svg?height=400&width=400"
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getPortfolio()
        if (data.hero) {
          setHeroData(data.hero)
        }
      } catch (error) {
        console.error("Failed to fetch hero data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white font-bold text-xl"
            >
              Portfolio
            </motion.div>
            <div className="hidden md:flex space-x-8">
              {["Home", "Skills", "Education", "Experience", "Projects", "Contact"].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 lg:mb-6"
              >
                {isLoading ? "Loading..." : heroData.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl text-purple-300 mb-4"
              >
                {isLoading ? "Loading..." : heroData.role}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base lg:text-lg text-white/80 mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0"
              >
                {isLoading ? "Loading..." : heroData.welcomeMessage}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("projects")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 lg:px-8 py-3"
                >
                  View My Work
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => window.open("#", "_blank")}
                  className="border-white/30 text-white hover:bg-white/10 px-6 lg:px-8 py-3"
                >
                  My CV
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex justify-center order-1 lg:order-2"
            >
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                <Image
                  src={heroData.image || "/placeholder.svg"}
                  alt="Profile"
                  width={400}
                  height={400}
                  className="w-full h-full object-contain"
                  style={{ filter: "drop-shadow(0px 0px 10px rgba(0,0,0,0.2))" }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection("skills")}
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Skills & Expertise</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Technologies and tools I use to bring ideas to life
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(portfolioData.skills).map(([category, skills], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-white capitalize text-xl">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, skillIndex) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: skillIndex * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          viewport={{ once: true }}
                        >
                          <Badge
                            variant="secondary"
                            className="bg-purple-600/20 text-purple-300 hover:bg-purple-600/30"
                          >
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Education</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">My academic journey and continuous learning</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {portfolioData.education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative mb-12 last:mb-0"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full mr-4">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{edu.degree}</h3>
                    <p className="text-purple-300">{edu.institution}</p>
                    <p className="text-white/60">{edu.year}</p>
                  </div>
                </div>
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm ml-16">
                  <CardContent className="pt-6">
                    <p className="text-white/80">{edu.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Experience</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">My professional journey and key achievements</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {portfolioData.experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="mb-12 last:mb-0"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-2xl mb-2">{exp.title}</CardTitle>
                        <div className="flex items-center text-purple-300 mb-2">
                          <Building className="w-4 h-4 mr-2" />
                          {exp.company}
                        </div>
                        <div className="flex items-center text-white/60">
                          <Calendar className="w-4 h-4 mr-2" />
                          {exp.period}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {exp.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="text-white/80 flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Featured Projects</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              A showcase of my recent work and creative solutions
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white">{project.title}</CardTitle>
                    <CardDescription className="text-white/70">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" className="border-purple-500/30 text-purple-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => window.open(project.liveUrl, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/10"
                        onClick={() => window.open(project.githubUrl, "_blank")}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-black/20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">Let's discuss your next project or just say hello</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Send a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      rows={5}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-4 text-purple-400" />
                    john.doe@example.com
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-4 text-purple-400" />
                    +1 (555) 123-4567
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 10 }}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <MapPin className="w-5 h-5 mr-4 text-purple-400" />
                    San Francisco, CA
                  </motion.div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Follow Me</h3>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Github className="w-6 h-6 text-white" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    href="#"
                    className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-white" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/60">© 2024 John Doe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
