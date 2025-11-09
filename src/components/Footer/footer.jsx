import { AppName } from "../../config";

const Footer = () => {
  return (
    <footer className="bg-white/10 backdrop-blur-sm border-t border-white/20 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm uppercase">
                {AppName[0]}
              </span>
            </div>
            <p className="font-bold text-black text-lg">{AppName}</p>
          </div>
          <p className="text-gray-600/80">
            &copy; 2025 - Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
