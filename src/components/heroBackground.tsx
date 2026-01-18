interface BackgroundProps {
  data: {
    backdrop_path: string;
    title: string;
  };
}

const Background: React.FC<BackgroundProps> = ({ data }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-[60vh] md:h-screen w-screen z-0 overflow-hidden">
      {/* IMAGE */}
      <img
        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
        alt={data.title}
        className="w-full h-full object-cover object-content"
      />

      {/* GRADIENT */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-black via-black/70 to-transparent" />
    </div>
  );
};

export default Background;


