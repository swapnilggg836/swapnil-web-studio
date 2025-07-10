
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import tourTravelImg from "@/assets/tour-travel.jpg";
import digitalBoardImg from "@/assets/digital-board.jpg";
import sentimentAnalysisImg from "@/assets/sentiment-analysis.jpg";
import tiffinEliteImg from "@/assets/tiffin-elite.jpg";
import chatbotImg from "@/assets/chatbot.jpg";
import paithaniSreeImg from "@/assets/paithani-sree.jpg";
import salesAnalysisImg from "@/assets/sales-analysis.jpg";
import smartRoverImg from "@/assets/smart-rover.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Tour & Travel",
      image: tourTravelImg,
      description: [
        "It is used to give the information to tourists",
        "HTML, CSS, and PHP used",
        "XAMPP server is used"
      ],
      githubLink: "https://github.com/your-username/tour-travel",
      liveLink: ""
    },
    {
      title: "Digital Board",
      image: digitalBoardImg,
      description: [
        "Scrolling Digital Display Board",
        "IoT Based, C++ and IC used",
        "C++ library used"
      ],
      githubLink: "https://github.com/your-username/digital-board",
      liveLink: ""
    },
    {
      title: "Sentiment Analysis",
      image: sentimentAnalysisImg,
      description: [
        "It analyzes the sentiment of YouTube comments",
        "Using Python",
        "Shows graph positive, negative & neutral comments"
      ],
      githubLink: "https://github.com/your-username/sentiment-analysis",
      liveLink: ""
    },
    {
      title: "Tiffin Elite",
      image: tiffinEliteImg,
      description: [
        "Full-stack web application for tiffin services",
        "PHP, AJAX, HTML, CSS used",
        "Login/Signup and ordering system",
        "Database connectivity and validation"
      ],
      githubLink: "https://github.com/your-username/tiffin-elite",
      liveLink: ""
    },
    {
      title: "Chatbot",
      image: chatbotImg,
      description: [
        "Interactive chatbot with natural conversation flow",
        "HTML, CSS, Flask (Python), Node.js",
        "JSON file for storing user responses",
        "Flask-based API for backend logic"
      ],
      githubLink: "https://github.com/your-username/chatbot-flask",
      liveLink: ""
    },
    {
      title: "Paithani Sree",
      image: paithaniSreeImg,
      description: [
        "Professional e-commerce site for Paithani sarees",
        "React.js, Next.js, Tailwind CSS",
        "Product listings with filtering & admin panel",
        "API integration and deployed on Hostinger"
      ],
      githubLink: "https://github.com/your-username/paithani-sree",
      liveLink: "https://paithani-sree.com"
    },
    {
      title: "Electronics Shop Sales Analysis",
      image: salesAnalysisImg,
      description: [
        "Business data analysis project using Power BI",
        "Multiple graphs and charts with drag-and-drop",
        "Sales trends and category-wise revenue",
        "Customer segmentation dashboard"
      ],
      githubLink: "https://github.com/your-username/sales-analysis",
      liveLink: ""
    },
    {
      title: "Smart Rover",
      image: smartRoverImg,
      description: [
        "Arduino-based rover for technical competitions",
        "Arduino Uno, Ultrasonic & Color sensors",
        "LDR sensor and robotic arm integration",
        "Obstacle detection and automated movement"
      ],
      githubLink: "https://github.com/your-username/smart-rover",
      liveLink: ""
    },
    {
      title: "YouTube Comment Sentiment Analysis",
      image: sentimentAnalysisImg,
      description: [
        "ML-based sentiment analysis for YouTube comments",
        "Python, Flask, HTML, CSS",
        "Classifies comments as Positive/Negative/Neutral",
        "Web interface with visual results"
      ],
      githubLink: "https://github.com/your-username/youtube-sentiment",
      liveLink: ""
    }
  ];

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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 border-2 hover:border-secondary/50"
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold text-foreground mb-4">
                  {project.title}
                </CardTitle>
                <CardDescription className="space-y-2 mb-4">
                  {project.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground text-sm">{desc}</span>
                    </div>
                  ))}
                </CardDescription>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a 
                      href={project.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <Github size={16} className="mr-2" />
                      Code
                    </a>
                  </Button>
                  
                  {project.liveLink && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a 
                        href={project.liveLink} 
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
      </div>
    </section>
  );
};

export default Projects;
