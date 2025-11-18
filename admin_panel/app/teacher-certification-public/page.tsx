'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '@/styles/modules/teachercertification.module.css';

// Типи для даних
interface TeacherCertificationItem {
  id: number;
  heading: string;
  description: string;
  text?: string;
  url?: string;
  linkText?: string;
  photoUrls: string[];
  imagePosition?: string;
  publicationDate?: string;
  createdAt?: string;
}

interface EventItem {
  id: string | number;
  title: string;
  text: string;
  images: string[];
  imagePosition?: string;
}

export default function TeacherCertificationPublicPage() {
  const [expandedEvent, setExpandedEvent] = useState<string | number | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dynamicItems, setDynamicItems] = useState<TeacherCertificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDynamicItems();
  }, []);

  const fetchDynamicItems = async () => {
    try {
      console.log('🔄 Завантаження динамічних елементів...');
      const response = await fetch('http://localhost:3000/api/teacher-certification');
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Отримано динамічних елементів:', data.length);
        
        // Логуємо imagePosition для кожного елемента
        data.forEach((item: any) => {
          console.log(`🖼️ ID ${item.id}: imagePosition = "${item.imagePosition}", photoUrls =`, item.photoUrls);
        });
        
        setDynamicItems(data);
      } else {
        console.error('❌ Помилка відповіді:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження динамічних елементів:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Статичні блоки (залишаються як є)
  const staticEvents: EventItem[] = [
    {
      id: 1,
      title: "Фінальне засідання педради – атестаційного саміту 'Педагогічна творчість. У чому її суть?'",
      text: `28 березня в Академічному ліцеї "Європейський" відбулося фінальне засідання педради – атестаційного саміту "Педагогічна творчість. У чому її суть?" Свій професійний досвід та особливості роботи цього разу презентували вчителі ППС іноземних мов. У невимушеній творчій атмосфері кожен поділився досягненнями та планами, власними напрацюваннями та знайденими новинками. Під час засідання ще раз переконалися, що викладання іноземної мови в ліцеї відбувається якісно та з урахуванням викликів сучасності, а вчителі старанно працюють над собою, розвиваючись та спрямовуючи максимум зусиль на результат.`,
      images: ['/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg'],
      imagePosition: 'center'
    },
    {
      id: 2,
      title: "Друге засідання педради - атестаційного саміту 'Педагогічна творчість. У чому її суть?'",
      text: `27 березня в Академічному ліцеї "Європейський" відбулося друге засідання педради — атестаційного саміту "Педагогічна творчість. У чому її суть?" Свій професійний досвід презентували вчителі ППС гуманітарних, суспільних дисциплін та початкових класів. Креативні педагоги ознайомили присутніх із результатами роботи за атестаційний період, із кроками професійного зростання та планами на майбутнє. Усі ще раз переконалися, що вчителі докладають максимум зусиль для того, щоб ліцеїсти здобули якісну освіту й стали справжніми патріотами своєї Батьківщини. Далі буде…`,
      images: ['/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg'],
      imagePosition: 'center'
    },
    {
      id: 3,
      title: "Педрада - атестаційний саміт «Педагогічна творчість. В чому її суть?». День 1",
      text: `26 березня в Академічному ліцеї «Європейський» стартувала педрада — атестаційний саміт «Педагогічна творчість. В чому її суть?». На першому засіданні презентували професійний досвід вчителі ППС точних та природничих наук, ЗУ, фізичної культури та кафедри виховної роботи. Спілкувалися, ділилися напрацюваннями, креативили та будували плани на майбутнє. Кожен педагог ліцею має великий досвід роботи та докладає максимум зусиль, щоб учні здобули якісну освіту. Далі буде…`,
      images: ['/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg'],
      imagePosition: 'center'
    },
  ];

  // Динамічні блоки (додаються зверху) - як на сторінці новин
  const dynamicEvents: EventItem[] = dynamicItems.filter((item: TeacherCertificationItem) => 
    item.heading && item.description && item.photoUrls && item.photoUrls.length > 0
  ).map((item: TeacherCertificationItem) => {
    console.log('🖼️ Обробка елемента з фото:', {
      id: item.id,
      heading: item.heading,
      photoUrls: item.photoUrls
    });
    
    const processedImages = Array.isArray(item.photoUrls) ? item.photoUrls.map((url: string) => {
      // Якщо URL вже повний (починається з http), використовуємо як є
      if (url.startsWith('http')) {
        return url;
      }
      // Якщо URL відносний, додаємо базовий URL
      return `http://localhost:3000${url}`;
    }) : [];
    
    console.log('🖼️ Оброблені зображення:', processedImages);
    
    return {
      id: `dynamic-${item.id}`,
      title: item.heading,
      text: item.description,
      images: processedImages,
      imagePosition: item.imagePosition || 'center'
    };
  });

  // Об'єднуємо динамічні (зверху) та статичні блоки
  const allEvents = [...dynamicEvents, ...staticEvents];

  // Елементи для відображення на рожевому фоні (адаптовано зі сторінки Підвищення кваліфікації)
  const pinkBackgroundItems = dynamicItems
    .filter(item => 
      // Текст без заголовка та опису (може бути з посиланням або без)
      (item.text && !item.heading && !item.description) ||
      // Посилання без заголовка та опису
      (item.url && !item.heading && !item.description)
    )
    .sort((a, b) => {
      // Сортуємо за датою створення (старі спочатку, нові знизу)
      const dateA = new Date(a.createdAt || a.publicationDate || 0);
      const dateB = new Date(b.createdAt || b.publicationDate || 0);
      console.log(`🔄 Сортування: ID ${a.id} (${dateA.toISOString()}) vs ID ${b.id} (${dateB.toISOString()})`);
      return dateA.getTime() - dateB.getTime(); // asc - старі спочатку, нові знизу
    });
  
  // Розділяємо на текст та посилання для рожевого фону
  const textItems = pinkBackgroundItems.filter(item => 
    item.text && !item.heading && !item.description
  );
  const linkItems = pinkBackgroundItems.filter(item => 
    item.url && !item.heading && !item.description
  );

  console.log('📋 Рожева секція - відфільтровані елементи:', pinkBackgroundItems.map(item => ({
    id: item.id,
    text: item.text?.substring(0, 50) + '...',
    url: item.url,
    createdAt: item.createdAt,
    publicationDate: item.publicationDate
  })));

  const handleReadMore = (id: string | number) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  const handleImageClick = (images: string[], index: number) => {
    setCurrentImage(images[index]);
    setCurrentImageIndex(index);
    setGalleryOpen(true);
  };

  const handleGalleryClose = () => {
    setGalleryOpen(false);
    setCurrentImage(null);
    setCurrentImageIndex(0);
  };

  const handlePrevImage = () => {
    const currentEvent = allEvents.find((item) => item.images.includes(currentImage || ''));
    if (currentEvent && currentImage) {
      const currentIndex = currentEvent.images.indexOf(currentImage);
      const prevIndex = (currentIndex - 1 + currentEvent.images.length) % currentEvent.images.length;
      setCurrentImage(currentEvent.images[prevIndex]);
      setCurrentImageIndex(prevIndex);
    }
  };

  const handleNextImage = () => {
    const currentEvent = allEvents.find((item) => item.images.includes(currentImage || ''));
    if (currentEvent && currentImage) {
      const currentIndex = currentEvent.images.indexOf(currentImage);
      const nextIndex = (currentIndex + 1) % currentEvent.images.length;
      setCurrentImage(currentEvent.images[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };


  // Функція для відображення тексту з пропущеними рядками
  const renderTextWithLineBreaks = (text: string) => {
    if (!text) return null;
    
    const paragraphs = text.split('\n\n');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index}>
        {paragraph.split('\n').map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </span>
        ))}
      </p>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.gradientBg}></div>
      </div>

      <main className={styles.eventsMain}>
        <h2 className={styles.eventsStreamTitle}>Атестація педпрацівників</h2>

        {isLoading ? (
          <div className={styles.eventsContainer}>
            <div className={styles.loadingMessage}>Завантаження додаткових матеріалів...</div>
          </div>
        ) : (
          <div className={styles.eventsList}>
            {allEvents.map((item) => (
              <div
                key={item.id}
                className={`${styles.eventItem} ${expandedEvent === item.id ? styles.expanded : ""}`}
              >
                <div className={styles.eventContent}>
                  <h3 className={styles.eventItemTitle}>{item.title}</h3>
                  <p
                    className={styles.eventItemText}
                    style={{ whiteSpace: 'pre-line' }}
                  >
                    {item.text}
                  </p>
                  <button
                    className={`${styles.readMoreBtn} ${expandedEvent === item.id ? styles.expanded : ""}`}
                    onClick={() => handleReadMore(item.id)}
                  >
                    {expandedEvent === item.id ? "Згорнути" : "Читати далі"}
                  </button>
                </div>
                {item.images && item.images.length > 0 && (
                  <div className={styles.eventImage}>
                    <img
                      src={item.images[0]}
                      alt="Event image"
                      onClick={() => handleImageClick(item.images, 0)}
                      data-position={item.imagePosition || 'center'}
                      onLoad={() => console.log(`🖼️ Зображення завантажено для ID ${item.id}, data-position = "${item.imagePosition || 'center'}"`)}
                    />
                    <a
                      href="#"
                      className={styles.eventImageOverlay}
                      onClick={(e) => {
                        e.preventDefault();
                        handleImageClick(item.images, 0);
                      }}
                    >
                      <span className={styles.viewMoreText}>
                        Переглянути всі фото
                      </span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Секція з документами та рожевим фоном */}
        <section className={styles.teacherCertificationDocuments}>
          <div className={styles.documentsContainer}>
            <p className={styles.documentsText}>Електронна адреса для подання документів педпрацівників, які атестуються <a href="mailto:atestacia24licey@gmail.com" className={styles.emailLink}>atestacia24licey@gmail.com</a></p>
            
            <p className={styles.documentsSubtitle}>Атестаційна комісія:</p>
            <div className={styles.documentsList}>
              <p className={styles.commissionMember}>Деркач Л.А. – голова комісії</p>
              <p className={styles.commissionMember}>Соколовська О.П. – секретар комісії</p>
              <p className={styles.commissionMember}>Коршак Т.В – член комісії</p>
              <p className={styles.commissionMember}>Овдієнко О.М. – член комісії</p>
              <p className={styles.commissionMember}>Нікул Ю.В. – член комісії</p>
              <p className={styles.commissionMember}>Мокренко Є.М. – член комісії</p>
              <p className={styles.commissionMember}>Сімонькіна Г.П. – член комісії</p>
              <p className={styles.commissionMember}>Головко С.Б. – член комісії</p>
              <p className={styles.commissionMember}>Когут К.С. – член комісії</p>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.documentsList}>
              <a href="https://docs.google.com/file/d/16pC6gZmJoge33TLgruXy-2mUAH3JjH2d/edit?filetype=msword" className={styles.documentLink} target="_blank" rel="noopener noreferrer">Результати атестації у 2025 році</a>
              <a href="https://docs.google.com/document/d/1eTJ1ba7kYMbTFR3ejLbg6JWHNcmtTVf3/edit" className={styles.documentLink} target="_blank" rel="noopener noreferrer">Список педагогічних працівників, які атестуються позачергово у 2025 році</a>
              <a href="https://docs.google.com/document/d/1aimztLwaSXP7raZ4xIHQlIVxVXJsSMkL/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">Список педагогічних працівників, які атестуються у 2024-2025 н.р.</a>
              <a href="https://docs.google.com/document/d/1pkadNTCdi6zgbcd_AzyC94nenbUxp6fJ/edit?tab=t.0" className={styles.documentLink} target="_blank" rel="noopener noreferrer">Графік проведення засідань атестаційної комісії І рівня Ліцею «Європейський» ЛМР</a>
            </div>

            {/* Динамічні елементи для рожевого фону (адаптовано зі сторінки Підвищення кваліфікації) */}
            {pinkBackgroundItems.length > 0 && (
              <>
                <div className={styles.divider}></div>
                <div className={styles.documentsBlock}>
                  {pinkBackgroundItems.map((item, index) => (
                    <div key={item.id}>
                      {/* Горизонтальна лінія та більший відступ перед текстом, якщо це не перший запис */}
                      {item.text && index > 0 && (
                        <>
                          <div className={styles.divider}></div>
                          <div style={{ marginTop: '40px' }}></div>
                        </>
                      )}
                      
                      {/* Текст, якщо є */}
                      {item.text && (
                        <div className={styles.documentsText}>
                          {renderTextWithLineBreaks(item.text)}
                        </div>
                      )}
                      
                      {/* Посилання, якщо є */}
                      {item.url && (
                        <div className={styles.documentsList}>
                          <a 
                            href={item.url} 
                            className={styles.documentLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {item.linkText || item.url}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Gallery Modal */}
      {galleryOpen && currentImage && (
        <div className={`${styles.galleryModal} ${styles.active}`}>
          <div className={styles.galleryContent}>
            <Image
              src={currentImage}
              alt="Gallery image"
              width={1200}
              height={800}
            />
            <div className={styles.galleryNav}>
              <button className={styles.galleryPrev} onClick={handlePrevImage}>
                ❮
              </button>
              <button className={styles.galleryNext} onClick={handleNextImage}>
                ❯
              </button>
            </div>
            <button className={styles.galleryClose} onClick={handleGalleryClose}>
              ×
            </button>
            <div className={styles.galleryCounter}>
              {currentImageIndex + 1} /{" "}
              {allEvents.find((item) => item.images.includes(currentImage))?.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
