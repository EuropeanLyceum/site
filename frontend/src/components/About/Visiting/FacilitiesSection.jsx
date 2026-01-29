'use client';

import Image from 'next/image';
import { Box, Typography, List, ListItem } from '@mui/material';

import styles from '../../../styles/visitingcard.module.css';
import materialBasis from '@/assets/photos/building/material_basis.jpg';
import checkIcon from '@/assets/photos/icons/galochka-icon.png';

export default function FacilitiesSection({ t }) {
    return (
        <Box component="section" className={styles.section}>
            {/* Заголовок — MUI */}
            <Typography variant="h1">
                {t('facilitiesTitle')}
            </Typography>

            {/* GRID + layout — CSS */}
            <Box className={styles.facilitiesContent}>
                {/* Фото */}
                <Image
                    src={materialBasis}
                    alt={t('facilitiesPhotoAlt')}
                    width={700}
                    height={450}
                />

                {/* Список — MUI + CSS */}
                <List className={styles.facilitiesList}>
                    {[
                        'classrooms26Description',
                        'englishCabinets10Description',
                        'modernCabinetsDescription',
                        'resourceCenterDescription',
                        'hallsDescription',
                        'multimediaCenterDescription',
                    ].map(key => (
                        <ListItem
                            key={key}
                            className={styles.facilitiesItem}
                            disableGutters
                        >
                            <Image
                                src={checkIcon}
                                alt=""
                                width={22}
                                height={22}
                            />
                            <Typography component="span">
                                {t(key)}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}