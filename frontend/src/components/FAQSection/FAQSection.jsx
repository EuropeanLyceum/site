"use client";

import { useState } from "react";
import Image from "next/image";

const FAQSection = ({
  options = [],
  title = "FAQ (поширені запитання)",
  image = null,
  imageAlt = "FAQ Image",
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="faq-section">
      {image && (
        <div className="faq-image">
          <Image src={image} alt={imageAlt} className="firebird-image" />
        </div>
      )}
      <div className="faq-container">
        <div className="faq-content">
          <h2 className="faq-title">{title}</h2>

          <div className="accordion">
            {options.map((item, index) => (
              <div
                key={index}
                className={`accordion-item ${activeIndex === index ? "active" : ""}`}
              >
                <button
                  className="accordion-button"
                  onClick={() => toggleAccordion(index)}
                >
                  <span>{item.label}</span>
                  <div className="arrow"></div>
                </button>
                <div className="accordion-content">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
