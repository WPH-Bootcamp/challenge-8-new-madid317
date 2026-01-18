import logoMovie from "../assets/logo-movie.svg"

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-gray-700" style={{ borderTopWidth: '0.5px' }}>
      <div
        className="
          max-w-7xl mx-auto
          flex flex-col md:flex-row
          items-start md:items-center
          md:justify-between
          gap-4
          py-6 px-5 md:px-10
          text-gray-600
        "
      >
        <img
          src={logoMovie}
          alt="Logo Movie"
          className="h-8"
        />

        <h1 className="text-xs md:text-base text-left md:text-right">
          Copyright ©2025 Movie Explorer
        </h1>
      </div>
    </footer>
  );
};

export default Footer;