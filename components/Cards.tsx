interface cardProps {
    img: string;
    description: string;
    buttonText: string;
    buttonLink: string;
}

export default function Card({ img, description, buttonText, buttonLink }: cardProps) {
    return (
        <div className="linear-gradient rounded-lg shadow-[10px_10px_#000] overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col items-center w-60 h-80">
            <img className="mt-5 w-auto h-16 object-cover" src={img} alt="Card Image" />
            <div className="text-center p-4">
                <p className="mb-5 font-bold text-black">{description}</p>
                <a href={buttonLink} className="inline-block font-[IntroRust] text-[0.8rem] bg-lime-300 hover:bg-lime-400 text-black font-bold py-2 px-4 rounded-full border-dashed border-2 mx-auto my-auto">
                    {buttonText}
                </a>
            </div>
        </div>
    );
}