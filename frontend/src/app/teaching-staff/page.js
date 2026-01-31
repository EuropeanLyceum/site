'use client';

import {useState, useEffect} from 'react';
import {Box, Typography, Button, Menu, MenuItem, CircularProgress, Grid, Container} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useTranslation} from '@/contexts/TranslationProvider';
import StaffCard from "@/app/teaching-staff/components/StaffCard.jsx";


export default function TeachingStaffPage() {
    const {t, locale} = useTranslation("teachers");
    const [staffData, setStaffData] = useState([
        {
            "id": 1,
            "categoryId": "1",
            "fullName": "Мельник Олександр Петрович",
            "fullNameEn": "Oleksandr Melnyk",
            "photoUrl": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&h=500&auto=format&fit=crop",
            "description": "<p>Директор закладу. Кандидат наук, доцент. Має понад 20 років стажу в галузі освіти.</p><p>Відповідає за стратегічний розвиток та міжнародне співробітництво.</p>",
            "descriptionEn": "<p>Director of the institution. PhD, Associate Professor. Has over 20 years of experience in education.</p>"
        },
        {
            "id": 2,
            "categoryId": "2",
            "fullName": "Коваленко Олена Вікторівна",
            "fullNameEn": "Olena Kovalenko",
            "photoUrl": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&h=500&auto=format&fit=crop",
            "description": "<p>Старший викладач Fullstack розробки. Спеціалізується на React, Next.js та Node.js.</p><p>Керує студентським науковим гуртком 'Web Innovation'. Активно впроваджує сучасні методики навчання через практику (Project-based learning).</p>",
            "descriptionEn": "<p>Senior Fullstack Development Lecturer. Specializes in React, Next.js, and Node.js.</p>"
        },
        {
            "id": 3,
            "categoryId": "2",
            "fullName": "Петренко Ігор Дмитрович",
            "fullNameEn": "Ihor Petrenko",
            "photoUrl": null,
            "description": "<p>Викладач архітектури баз даних та системного адміністрування. Сертифікований спеціаліст Cisco.</p>",
            "descriptionEn": "<p>Lecturer in database architecture and system administration. Certified Cisco specialist.</p>"
        },
        {
            "id": 4,
            "categoryId": "3",
            "fullName": "Шевченко Марія Іванівна",
            "fullNameEn": "Mariia Shevchenko",
            "photoUrl": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=500&auto=format&fit=crop",
            "description": "<p>Професор кафедри філології. Досліджує сучасні мовні тренди та психолінгвістику.</p><p>Автор понад 50 наукових праць та 3 монографій. Куратор літературного клубу університету.</p>",
            "descriptionEn": "<p>Professor of the Department of Philology. Researches modern linguistic trends and psycholinguistics.</p>"
        }
    ]);
    const [categories, setCategories] = useState([
            {
                "id": "1",
                "name": "Адміністрація",
                "nameEn": "Administration"
            },
            {
                "id": "2",
                "name": "Кафедра IT та програмування",
                "nameEn": "IT and Programming Department"
            },
            {
                "id": "3",
                "name": "Кафедра гуманітарних наук",
                "nameEn": "Department of Humanities"
            }
        ]
    );
    const [selectedItem, setSelectedItem] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getLocalizedCategoryName = (category) =>
        locale === 'en' ? category.nameEn || category.name : category.name;

    // useEffect(() => {
    //   const fetchData = async () => {
    //     try {
    //       const [catRes, staffRes] = await Promise.all([
    //         fetch('/api/staff-categories'),
    //         fetch('/api/staff')
    //       ]);
    //
    //       const categoriesData = await catRes.json();
    //       const staffData = await staffRes.json();
    //
    //       setCategories(categoriesData);
    //       setStaffData(staffData);
    //
    //       if (categoriesData.length > 0) {
    //         setSelectedItem(getLocalizedCategoryName(categoriesData[0]));
    //       }
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   fetchData();
    // }, [locale]);

    const handleSelect = (category) => {
        setSelectedItem(getLocalizedCategoryName(category));
        setAnchorEl(null);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const currentStaff = staffData.filter(staff => {
        const category = categories.find(cat => getLocalizedCategoryName(cat) === selectedItem);
        return category ? staff.categoryId === category.id : false;
    });

    return (
        <Box sx={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
            pt: 2,
            pb: {xs: 4, md: 8},
        }}>
            <Box sx={{maxWidth: 1200, mx: 'auto', px: 2, textAlign: 'center', mb: 8, mt: 2}}>
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 900,
                        color: '#182BA1',
                        mb: 4,
                        fontSize: {xs: 32, md: 48},
                        fontFamily: "'Montserrat Alternates', sans-serif"
                    }}
                >
                    {t('pedagogicalTeam')}
                </Typography>

                <Button
                    endIcon={<KeyboardArrowDownIcon/>}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        background: '#fff',
                        borderRadius: '16px',
                        px: {xs: 3, md: 5},
                        py: 2,
                        color: '#1e293b',
                        fontWeight: 700,
                        fontSize: {xs: 14, md: 16},
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        textTransform: 'none',
                        border: '1px solid #E2E8F0',
                        '&:hover': {background: '#f8fafc', borderColor: '#182BA1'}
                    }}
                >
                    {selectedItem || (isLoading ? t('loading') : t('choose'))}
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        sx: {borderRadius: 3, mt: 1, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minWidth: 250}
                    }}
                >
                    {categories.map((cat) => (
                        <MenuItem
                            key={cat.id}
                            selected={getLocalizedCategoryName(cat) === selectedItem}
                            onClick={() => handleSelect(cat)}
                            sx={{py: 1.5, fontWeight: 500}}
                        >
                            {getLocalizedCategoryName(cat)}
                        </MenuItem>
                    ))}
                </Menu>
            </Box>

            <Container maxWidth="xl">
                {isLoading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 10}}>
                        <CircularProgress thickness={5} size={60} sx={{color: '#182BA1'}}/>
                    </Box>
                ) : currentStaff.length === 0 ? (
                    <Typography sx={{textAlign: 'center', py: 10, color: '#64748B', fontSize: 18}}>
                        {t('noTeachersInCategory').replace('{category}', selectedItem)}
                    </Typography>
                ) : (
                    <Grid container spacing={4}>
                        {currentStaff.map((staff) => (
                            <Grid item size={{xs: 12, lg: 6}} key={staff.id}>
                                <StaffCard staff={staff} locale={locale} t={t}/>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}