import React from "react";
import Marquee from "react-fast-marquee";
import logoCasio from '../assets/brands/casio.png';
import logoAmazon from '../assets/brands/amazon.png';
import logoMoonstar from '../assets/brands/moonstar.png';
import logoStar from '../assets/brands/star.png';
import logoStartpeople from '../assets/brands/start_people.png';
import logoRandstad from '../assets/brands/randstad.png';

const logos = [
  logoCasio,
  logoAmazon,
  logoMoonstar,
  logoStar,
  logoStartpeople,
  logoRandstad,
];

const ClientLogos = () => (
  <section className="bg-gray-100 pt-8 pb-12 my-4">
    <div className="max-w-7xl mx-auto text-center mb-8 px-4">
      <h2 className="text-2xl font-extrabold text-secondary">
        We've helped thousands of sales teams
      </h2>
    </div>

    <Marquee pauseOnHover gradient={false} speed={50} autoFill={true}>
      {logos.map((logo, index) => (
        <img
          key={index}
          src={logo}
          alt={`Logo ${index}`}
          className="h-8 md:h-10 w-auto object-contain flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300 mx-6"
        />
      ))}
    </Marquee>
  </section>
);

export default ClientLogos;
