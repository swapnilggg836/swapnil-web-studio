import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

// Fallback images for projects without uploaded images
import tourTravelImg from "@/assets/tour-travel.jpg";
import digitalBoardImg from "@/assets/digital-board.jpg";
import sentimentAnalysisImg from "@/assets/sentiment-analysis.jpg";
import tiffinEliteImg from "@/assets/tiffin-elite.jpg";
import chatbotImg from "@/assets/chatbot.jpg";
import paithaniSreeImg from "@/assets/paithani-sree.jpg";
import salesAnalysisImg from "@/assets/sales-analysis.jpg";
import smartRoverImg from "@/assets/smart-rover.jpg";

// Fallback static projects (used when database is empty)
const fallbackProjects = [
  {
    id: "1",
    title: "Tour & Travel",
    image_url: tourTravelImg,
    description: [
      "It is used to give the information to tourists",
      "HTML, CSS, and PHP used",
      "XAMPP server is used"
    ],
    tech_stack: "HTML, CSS, PHP",
    github_link: "https://github.com/your-username/tour-travel",
    live_link: ""
  },
  {
    id: "2",
    title: "Digital Board",
    image_url: digitalBoardImg,
    description: [
      "Scrolling Digital Display Board",
      "IoT Based, C++ and IC used",
      "C++ library used"
    ],
    tech_stack: "C++, IoT",
    github_link: "https://github.com/your-username/digital-board",
    live_link: ""
  },
  {
    id: "3",
    title: "Sentiment Analysis",
    image_url: sentimentAnalysisImg,
    description: [
      "It analyzes the sentiment of YouTube comments",
      "Using Python",
      "Shows graph positive, negative & neutral comments"
    ],
    tech_stack: "Python, Flask",
    github_link: "https://github.com/your-username/sentiment-analysis",
    live_link: ""
  },
  {
    id: "4",
    title: "Tiffin Elite",
    image_url: tiffinEliteImg,
    description: [
      "Full-stack web application for tiffin services",
      "PHP, AJAX, HTML, CSS used",
      "Login/Signup and ordering system",
      "Database connectivity and validation"
    ],
    tech_stack: "PHP, AJAX, MySQL",
    github_link: "https://github.com/your-username/tiffin-elite",
    live_link: ""
  },
  {
    id: "5",
    title: "Chatbot",
    image_url: chatbotImg,
    description: [
      "Interactive chatbot with natural conversation flow",
      "HTML, CSS, Flask (Python), Node.js",
      "JSON file for storing user responses",
      "Flask-based API for backend logic"
    ],
    tech_stack: "Flask, Python, Node.js",
    github_link: "https://github.com/your-username/chatbot-flask",
    live_link: ""
  },
  {
    id: "6",
    title: "Paithani Sree",
    image_url: paithaniSreeImg,
    description: [
      "Professional e-commerce site for Paithani sarees",
      "React.js, Next.js, Tailwind CSS",
      "Product listings with filtering & admin panel",
      "API integration and deployed on Hostinger"
    ],
    tech_stack: "React, Next.js, Tailwind",
    github_link: "https://github.com/your-username/paithani-sree",
    live_link: "https://paithani-sree.com"
  },
  {
    id: "7",
    title: "Electronics Shop Sales Analysis",
    image_url: salesAnalysisImg,
    description: [
      "Business data analysis project using Power BI",
      "Multiple graphs and charts with drag-and-drop",
      "Sales trends and category-wise revenue",
      "Customer segmentation dashboard"
    ],
    tech_stack: "Power BI, Excel",
    github_link: "https://github.com/your-username/sales-analysis",
    live_link: ""
  },
  {
    id: "8",
    title: "Smart Rover",
    image_url: smartRoverImg,
    description: [
      "Arduino-based rover for technical competitions",
      "Arduino Uno, Ultrasonic & Color sensors",
      "LDR sensor and robotic arm integration",
      "Obstacle detection and automated movement"
    ],
    tech_stack: "Arduino, C++, IoT",
    github_link: "https://github.com/your-username/smart-rover",
    live_link: ""
  },
  {
    id: "9",
    title: "YouTube Comment Sentiment Analysis",
    image_url: sentimentAnalysisImg,
    description: [
      "ML-based sentiment analysis for YouTube comments",
      "Python, Flask, HTML, CSS",
      "Classifies comments as Positive/Negative/Neutral",
      "Web interface with visual results"
    ],
    tech_stack: "Python, Flask, ML",
    github_link: "https://github.com/your-username/youtube-sentiment",
    live_link: ""
  }
];

const Projects = () => {
  const { projects: dbProjects, loading } = useProjects();
  
  // Use database projects if available, otherwise fallback to static
  const projects = dbProjects.length > 0 ? dbProjects : fallbackProjects;

  return (
    <section id="projects" className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Projects
          </h2>
          <p className="text-muted-foreground text-lg">
            A showcase of my technical journey through internships and academic projects
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-secondary/50"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={project.image_url || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </CardTitle>
                  <p className="text-sm text-secondary font-medium mb-4">{project.tech_stack}</p>
                  <CardDescription className="space-y-2 mb-4">
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-muted-foreground text-sm">{desc}</span>
                      </div>
                    ))}
                  </CardDescription>
                  
                  <div className="flex space-x-2 mt-4">
                    {project.github_link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a 
                          href={project.github_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <Github size={16} className="mr-2" />
                          Code
                        </a>
                      </Button>
                    )}
                    
                    {project.live_link && (
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a 
                          href={project.live_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink size={16} className="mr-2" />
                          Live
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
