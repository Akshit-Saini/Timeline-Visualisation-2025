import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './CenturySlider.css'; // Custom CSS if needed

// Fun facts for each century
const funFacts = {
  '4th Century': 'Christianity begins to spread in Ireland, setting the stage for the arrival of St. Patrick.',
  '5th Century': 'St. Patrick arrives in Ireland (traditionally 432 AD), beginning the conversion of the Irish to Christianity.',
  '6th Century': 'Monastic settlements flourish; St. Columba founds the monastery on Iona.',
  '7th Century': 'The Book of Durrow, one of the earliest illuminated manuscripts, is created.',
  '8th Century': 'Viking raids begin on Irish coasts, changing Irish society and politics.',
  '9th Century': 'Vikings establish settlements in Dublin, Waterford, and Limerick.',
  '10th Century': 'Brian Boru rises to power, uniting much of Ireland and defeating the Vikings.',
  '11th Century': 'The Battle of Clontarf (1014): Brian Boru defeats the Vikings but is killed in battle.',
  '12th Century': 'The Norman invasion of Ireland begins in 1169, transforming Irish society.',
  '13th Century': 'Construction of many stone castles and abbeys; English control expands.',
  '14th Century': 'The Black Death arrives in Ireland (1348), devastating the population.',
  '15th Century': 'The rise of powerful Gaelic clans and the decline of English authority outside the Pale.',
  '16th Century': 'The Tudor conquest of Ireland; the Reformation and religious conflict begin.',
  '17th Century': 'The Cromwellian conquest and the Williamite War reshape Irish land and society.',
  '18th Century': 'The Penal Laws restrict Catholic rights; the 1798 Rebellion seeks Irish independence.',
  '19th Century': 'The Great Famine (1845–1849) causes mass starvation and emigration.',
  '20th Century': 'The Easter Rising (1916), War of Independence, and partition create modern Ireland and Northern Ireland.'
};

// Placeholder stats for each century
const stats = {
  '4th Century': { topRole: 'Chieftain' },
  '5th Century': { topRole: 'Saint' },
  '6th Century': { topRole: 'Monk' },
  '7th Century': { topRole: 'Scholar' },
  '8th Century': { topRole: 'Warrior' },
  '9th Century': { topRole: 'King' },
  '10th Century': { topRole: 'High King' },
  '11th Century': { topRole: 'Warrior' },
  '12th Century': { topRole: 'Norman Lord' },
  '13th Century': { topRole: 'Abbot' },
  '14th Century': { topRole: 'Merchant' },
  '15th Century': { topRole: 'Clan Chief' },
  '16th Century': { topRole: 'Rebel' },
  '17th Century': { topRole: 'Landowner' },
  '18th Century': { topRole: 'Revolutionary' },
  '19th Century': { topRole: 'Emigrant' },
  '20th Century': { topRole: 'Politician' }
};

// Generate centuries from 4th to 20th
const centuries = Array.from({ length: 17 }, (_, i) => {
  const centuryNum = i + 4;
  const from = 100 * (centuryNum - 1) + 1;
  const to = 100 * centuryNum - 1;
  const label = `${centuryNum}th Century`;
  // Watermark: e.g., '9th'
  const watermark = label.split(' ')[0];
  return {
    label,
    from,
    to,
    funFact: funFacts[label] || `Notable events and people from the ${label}.`,
    watermark,
  };
});

const FancySlider = ({ onCenturySelect }) => {
  const [hovered, setHovered] = useState(null);

  const handleClick = (century) => {
    if (onCenturySelect) {
      onCenturySelect(century.from, century.to);
    }
  };

  return (
    <div className="slider-container">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        loop={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation
        modules={[EffectCoverflow, Pagination, Navigation]}
        className="mySwiper"
      >
        {centuries.map((item, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleClick(item)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={hovered === index ? 'century-hovered' : ''}
          >
            <div className="century-card">
              <div className="century-number-main">{item.watermark}</div>
              {/* Top Role */}
              {stats[item.label] && (
                <div className="century-stats">
                  <span>Top role: {stats[item.label].topRole}</span>
                </div>
              )}
              {/* Fun Fact */}
              <div className="century-funfact" style={{ opacity: hovered === index ? 1 : 0 }}>
                {item.funFact}
              </div>
              {/* Mini timeline/bar chart placeholder */}
              <div className="century-mini-chart" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FancySlider;