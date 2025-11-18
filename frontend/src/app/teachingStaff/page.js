'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/teachingstaff.module.css';
import derkachPhoto from '@/assets/derkach.jpg';
import { useTranslation } from '@/contexts/TranslationProvider';

export default function TeachingStaffPage() {
  const { t, locale } = useTranslation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [staffData, setStaffData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Діагностика перекладу
  console.log('TeachingStaff - Current locale:', locale);
  console.log('TeachingStaff - Translation test:', t('pedagogicalTeam'));

  // Функція для отримання локалізованого контенту
  const getLocalizedContent = (staff) => {
    if (locale === 'en') {
      return {
        fullName: staff.fullNameEn || staff.fullName, // fallback до української
        description: staff.descriptionEn || staff.description
      };
    }
    return {
      fullName: staff.fullName,
      description: staff.description
    };
  };

  // Функція для отримання локалізованої назви категорії
  const getLocalizedCategoryName = (category) => {
    if (locale === 'en') {
      return category.nameEn || category.name; // fallback до української
    }
    return category.name;
  };

  // Отримання категорій та вчителів
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Отримуємо категорії
        const categoriesResponse = await fetch('http://localhost:3001/api/staff-categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
          
          // Встановлюємо першу категорію як обрану за замовчуванням
          if (categoriesData.length > 0 && !selectedItem) {
            const firstCategoryName = getLocalizedCategoryName(categoriesData[0]);
            setSelectedItem(firstCategoryName);
          }
        }

        // Отримуємо всіх вчителів
        const staffResponse = await fetch('http://localhost:3001/api/staff');
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          setStaffData(staffData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Оновлюємо обрану категорію при зміні мови
  useEffect(() => {
    if (categories.length > 0 && selectedItem) {
      // Знаходимо категорію за поточною обраною назвою
      const currentCategory = categories.find(cat => 
        cat.name === selectedItem || cat.nameEn === selectedItem
      );
      
      if (currentCategory) {
        const localizedName = getLocalizedCategoryName(currentCategory);
        if (localizedName !== selectedItem) {
          setSelectedItem(localizedName);
        }
      }
    }
  }, [locale, categories]);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemSelect = (category) => {
    const localizedName = getLocalizedCategoryName(category);
    setSelectedItem(localizedName);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Фільтрація вчителів за категорією
  const getStaffByCategory = (selectedCategoryName) => {
    // Знаходимо категорію за локалізованою назвою
    const category = categories.find(cat => 
      getLocalizedCategoryName(cat) === selectedCategoryName
    );
    
    if (!category) return [];
    
    return staffData.filter(staff => staff.categoryId === category.id);
  };

  // Отримуємо вчителів для поточної категорії
  const currentStaff = getStaffByCategory(selectedItem);

  return (
    <div className={styles.teachingStaffPage} lang={locale}>
      <main>
        <div className={styles.titleSection}>
          <h1 className={styles.pedagogicalTitle}>{t("pedagogicalTeam")}</h1>
          <div className={styles.yearSelector} ref={dropdownRef}>
            <button className={`${styles.yearButton} ${isDropdownOpen ? styles.active : ''}`} onClick={toggleDropdown}>
              <span className={styles.yearText}>{selectedItem || t("loading")}</span>
              <span className={styles.yearArrow}></span>
            </button>
            <div className={`${styles.yearDropdownContent} ${isDropdownOpen ? styles.active : ''}`}>
              {categories.map((category) => {
                const localizedName = getLocalizedCategoryName(category);
                return (
                  <a 
                    key={category.id}
                    href="#" 
                    className={selectedItem === localizedName ? styles.selected : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemSelect(category);
                    }}
                  >
                    {localizedName}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.adminCardsContainer}>

          {/* Динамічний контент з адмін-панелі */}
          {!isLoading && currentStaff.length > 0 && currentStaff.map((staff) => {
            const localized = getLocalizedContent(staff);
            
            return (
              <div key={staff.id} className={styles.adminCard}>
                <div className={styles.adminPhoto}>
                  {staff.photoUrl ? (
                    <img
                      src={`http://localhost:3001${staff.photoUrl}`}
                      alt={localized.fullName}
                      style={{ borderRadius: '10px' }}
                      onError={(e) => {
                        console.error('Помилка завантаження зображення:', staff.photoUrl);
                        console.log('Full URL:', `http://localhost:3001${staff.photoUrl}`);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '220px',
                      height: '310px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '14px'
                    }}>
                      {t("photoMissing")}
                    </div>
                  )}
                </div>
                <div className={styles.adminInfo}>
                  <div className={styles.adminName}>{localized.fullName}</div>
                  <div className={styles.adminBio}>
                    {/* Використовуємо dangerouslySetInnerHTML для підтримки переносів рядків */}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: localized.description.replace(/\n/g, '<br>')
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Повідомлення, якщо немає вчителів у категорії */}
          {!isLoading && currentStaff.length === 0 && selectedItem && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666',
              fontSize: '18px'
            }}>
              {t("noTeachersInCategory").replace("{category}", selectedItem)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}