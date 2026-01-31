'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Menu, MenuItem, CircularProgress, Grid } from '@mui/material';
import { useTranslation } from '@/contexts/TranslationProvider';
import StaffCard from "@/app/teaching-staff/components/StaffCard.jsx";


export default function TeachingStaffPage() {
  const { t, locale } = useTranslation("teachers");
  const [staffData, setStaffData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const open = Boolean(anchorEl);

  const getLocalizedCategoryName = (category) =>
      locale === 'en' ? category.nameEn || category.name : category.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch('/api/staff-categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedItem(getLocalizedCategoryName(categoriesData[0]));
        }

        const staffResponse = await fetch('/api/staff');
        const staffData = await staffResponse.json();
        setStaffData(staffData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const handleDropdownClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (category) => {
    setSelectedItem(getLocalizedCategoryName(category));
    handleClose();
  };

  const getStaffByCategory = (selectedCategoryName) => {
    const category = categories.find(cat => getLocalizedCategoryName(cat) === selectedCategoryName);
    if (!category) return [];
    return staffData.filter(staff => staff.categoryId === category.id);
  };

  const currentStaff = getStaffByCategory(selectedItem);

  return (
      <Box sx={{ width: '100%', minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', py: 8, mt: 4 }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#182BA1', mb: 3 }}>
            {t('pedagogicalTeam')}
          </Typography>
          <Button
              variant="contained"
              onClick={handleDropdownClick}
              sx={{
                background: 'linear-gradient(145deg, #f97316 0%, #ea580c 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                color: '#fff',
                fontWeight: 600
              }}
          >
            {selectedItem || t('loading')}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {categories.map((cat) => (
                <MenuItem key={cat.id} selected={getLocalizedCategoryName(cat) === selectedItem} onClick={() => handleSelect(cat)}>
                  {getLocalizedCategoryName(cat)}
                </MenuItem>
            ))}
          </Menu>
        </Box>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
        ) : currentStaff.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 10, color: '#666', fontSize: 18 }}>
              {t('noTeachersInCategory').replace('{category}', selectedItem)}
            </Typography>
        ) : (
            <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: 1200, mx: 'auto' }}>
              {currentStaff.map((staff) => (
                  <Grid item size={{xs: 12, sm: 12, md: 6, lg: 6, xl: 4}} key={staff.id}>
                    <StaffCard staff={staff} locale={locale} />
                  </Grid>
              ))}
            </Grid>
        )}
      </Box>
  );
}
