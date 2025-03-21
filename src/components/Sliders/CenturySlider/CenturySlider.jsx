import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './CenturySlider.css'; // Custom CSS if needed

const centuries = [
  { label: '4th Century', img: '/pic/Maps/Map_ireland_4th.jpg', link: '/century/4th' },
  { label: '5th Century', img: '/pic/Maps/Map_ireland_5th.jpg', link: '/century/5th' },
  { label: '6th Century', img: '/pic/Maps/Map_ireland_6th.jpg', link: '/century/6th' },
  { label: '7th Century', img: '/pic/Maps/Map_ireland_7th.jpg', link: '/century/7th' },
  { label: '8th Century', img: '/pic/Maps/Map_ireland_8th.jpg', link: '/century/8th' },
  { label: '9th Century', img: '/pic/Maps/Map_ireland_9th.jpg', link: '/century/9th' },
];

const FancySlider = () => {
  const handleClick = (link) => {
    window.location.href = link;
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
          <SwiperSlide key={index} onClick={() => handleClick(item.link)}>
            <img src={item.img} alt={item.label} />
            <h3>{item.label}</h3>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default FancySlider;