import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import tourTravelImg from "@/assets/tour-travel.jpg";
import digitalBoardImg from "@/assets/digital-board.jpg";
import sentimentAnalysisImg from "@/assets/sentiment-analysis.jpg";

const Projects = () => {
  const projects = [
    {
      title: "Tour & Travel",
      image: tourTravelImg,
      description: [
        "It is used to give the information to tourists",
        "HTML, CSS, and PHP used",
        "XAMPP server is used"
      ]
    },
    {
      title: "Digital Board",
      image: digitalBoardImg,
      description: [
        "Scrolling Digital Display Board",
        "IoT Based, C++ and IC used",
        "C++ library used"
      ]
    },
    {
      title: "Sentiment Analysis",
      image: sentimentAnalysisImg,
      description: [
        "It analyzes the sentiment of YouTube comments",
        "Using Python",
        "Shows graph positive, negative & neutral comments"
      ]
    }
  ];

  return (
    <section id="projects" className="py-20 bg-section-bg">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Projects
          </h2>
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
                <CardDescription className="space-y-2">
                  {project.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;