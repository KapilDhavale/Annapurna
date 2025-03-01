import React, { useEffect } from "react";
import about1 from "../images/about1.jpg";  // Adjust path as needed
import about2 from "../images/about2.jpg";  // Adjust path as needed
import "./About.css"; // Ensure you have this CSS file

const About = () => {
  useEffect(() => {
    const fadeElements = document.querySelectorAll(".fade-in");

    const fadeInOnScroll = () => {
      fadeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          el.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", fadeInOnScroll);
    fadeInOnScroll();

    return () => window.removeEventListener("scroll", fadeInOnScroll);
  }, []);

  return (
    <section id="about">
      <div id="about-head">ABOUT</div>
      <div className="about-us">
        <div className="about-heading">
          <span>Annapurna: Spreading Kindness, One Meal at a Time</span>
        </div>

        <div className="about-content">
          <span>
            At <b>Annapurna</b>, we believe that <b>no one should go to bed hungry</b>. Our platform
            connects generous donors with those in need, creating a seamless food donation network
            that makes a real impact in communities. Whether it's surplus food from homes, restaurants, or events, our system ensures that every meal reaches the right hands—fresh, safe, and on time.
          </span>
        </div>

        <div className="about-mission">
          <span className="mission-heading">🌍 Our Mission</span>
          <span>
            To bridge the gap between <b>food surplus and food scarcity</b> by leveraging technology,
            community engagement, and compassion. We empower individuals, businesses, and NGOs to
            donate with ease and help eliminate hunger.
          </span>
        </div>

        {/* Transition Image 1 - Enter from Left */}
        <div className="transition-image left">
          <img src={about1} alt="Our Impact" className="fade-in" />
        </div>

        <div className="about-how-it-works">
          <span className="how-it-works-heading">🚀 How We Work</span>
          <ul>
            <li>
              <span><b>Donate with Ease</b> – Share surplus food with a single click.</span>
            </li>
            <li>
              <span><b>Smart Distribution</b> – Our network ensures food reaches verified NGOs and those in need.</span>
            </li>
            <li>
              <span><b>Impact Tracking</b> – See how your contributions make a difference.</span>
            </li>
          </ul>
        </div>

        {/* Transition Image 2 - Enter from Right */}
        <div className="transition-image right">
          <img src={about2} alt="Food Donation Process" className="fade-in" />
        </div>

        <div className="about-join-us">
          <span className="join-us-heading">🤝 Join Us in Making a Change!</span>
          <span>
            Whether you’re an individual, a business, or a volunteer, Annapurna welcomes you.
            Together, we can <b>reduce food waste and nourish lives</b>—because every meal counts!
          </span>
        </div>

        <div className="about-call-to-action">
          <span>🔗 <b>Be the reason someone smiles today.</b> Start donating now!</span>
        </div>
      </div>
    </section>
  );
};

export default About;