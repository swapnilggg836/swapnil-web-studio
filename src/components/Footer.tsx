import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleFooterClick = () => {
    navigate("/admin/login");
  };

  return (
    <footer className="bg-primary text-primary-foreground py-6">
      <div className="container mx-auto px-4 text-center">
        <p 
          className="text-sm cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleFooterClick}
          title="Admin Access"
        >
          © Created by Swapnil Gaikwad
        </p>
      </div>
    </footer>
  );
};

export default Footer;
