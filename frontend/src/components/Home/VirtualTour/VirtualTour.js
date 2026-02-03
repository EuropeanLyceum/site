"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Box, Typography, Container, IconButton, Paper, Divider,
  Stack, Card, CardActionArea, useTheme, alpha
} from "@mui/material";
import {
  ChevronLeft, ChevronRight, LocationOn, InfoOutlined,
  Fullscreen, CenterFocusWeak
} from "@mui/icons-material";
import { useTranslation } from "@/contexts/TranslationProvider.jsx";
import { locations } from "./data.js";

const RenderIcon = ({ icon: Icon }) => {
  if (typeof Icon === "function") return <Icon />;
  return <span style={{ fontSize: '1.5rem' }}>{Icon}</span>;
};

// --- Optimized Map Button Component ---
const MapButton = React.memo(({ id, currentId, connections, onClick, name, icon }) => {
  const isCurrent = id === currentId;
  const isAccessible = connections.includes(id);

  return (
      <Card
          elevation={0}
          sx={{
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            bgcolor: isCurrent ? '#f97316' : isAccessible ? '#fff' : alpha('#94a3b8', 0.1),
            border: '1px solid',
            borderColor: isCurrent ? '#f97316' : '#e2e8f0',
            borderRadius: 4,
            transform: isCurrent ? 'scale(1.03)' : 'none',
            '&:hover': {
              borderColor: isAccessible ? '#182BA1' : '#e2e8f0',
              transform: isAccessible ? 'translateY(-2px)' : 'none',
              boxShadow: isAccessible ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
            },
            opacity: isAccessible || isCurrent ? 1 : 0.6
          }}
      >
        <CardActionArea
            onClick={() => isAccessible && onClick(id)}
            disabled={!isAccessible && !isCurrent}
            sx={{ p: 2, textAlign: 'center', height: '100%' }}
        >
          <Box sx={{ filter: isCurrent ? 'brightness(0) invert(1)' : 'none', mb: 0.5 }}>
            <RenderIcon icon={icon} />
          </Box>
          <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: isCurrent ? '#fff' : '#1e293b',
                fontSize: '0.75rem',
                lineHeight: 1.2,
                display: 'block'
              }}
          >
            {name}
          </Typography>
        </CardActionArea>
      </Card>
  );
});
MapButton.displayName = "MapButton";

const VirtualTour = () => {
  const { t } = useTranslation("virtual");
  const [currentLocation, setCurrentLocation] = useState("entrance");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const currentRoom = useMemo(() => locations[currentLocation], [currentLocation]);

  const navigateTo = useCallback((locationId) => {
    if (locationId === currentLocation) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentLocation(locationId);
      setCurrentImageIndex(0);
      setIsTransitioning(false);
    }, 400);
  }, [currentLocation]);

  const images = currentRoom.images || [currentRoom.image];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    setImageError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentLocation]);

  return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10 }}>
        {/* HERO SECTION - MATCHING STUDENTS PAGE */}
        <Box sx={{
          position: 'relative', py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #0c1865 0%, #182BA1 100%)',
          color: '#fff', overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0% 100%)',
          mb: 6
        }}>
          <Container maxWidth="lg">
            <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 64 }, fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif", mb: 1 }}>
              VIRTUAL <span style={{ color: '#f97316' }}>TOUR</span>
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8, maxWidth: 600 }}>
              {t("virtualTourSubtitle") || "Explore our modern campus facilities from anywhere in the world."}
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 4 }}>

            {/* MAIN VIEWPORT SECTION */}
            <Box>
              <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    borderRadius: 8,
                    overflow: 'hidden',
                    aspectRatio: '16/9',
                    bgcolor: '#000',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                  }}
              >
                <Box sx={{
                  width: '100%', height: '100%',
                  transition: 'all 0.5s ease',
                  opacity: isTransitioning ? 0.3 : 1,
                  transform: isTransitioning ? 'scale(1.02)' : 'scale(1)',
                }}>
                  <Image
                      src={imageError ? "https://via.placeholder.com/1200x800" : images[currentImageIndex]}
                      alt={currentRoom.name}
                      fill
                      priority
                      style={{
                        objectFit: 'cover',
                        objectPosition: currentRoom.objectPositions?.[currentImageIndex] || 'center'
                      }}
                      onError={() => setImageError(true)}
                  />
                </Box>

                {/* NAV ARROWS */}
                {hasMultiple && (
                    <Stack direction="row" justifyContent="space-between" sx={{ position: 'absolute', top: '50%', width: '100%', px: 2, transform: 'translateY(-50%)', zIndex: 10 }}>
                      <IconButton
                          onClick={() => setCurrentImageIndex(prev => prev - 1)}
                          disabled={currentImageIndex === 0}
                          sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' }, boxShadow: 2 }}
                      >
                        <ChevronLeft sx={{ color: '#182BA1' }} />
                      </IconButton>
                      <IconButton
                          onClick={() => setCurrentImageIndex(prev => prev + 1)}
                          disabled={currentImageIndex === images.length - 1}
                          sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: '#fff' }, boxShadow: 2 }}
                      >
                        <ChevronRight sx={{ color: '#182BA1' }} />
                      </IconButton>
                    </Stack>
                )}

                {/* FLOATING GLASS OVERLAY */}
                <Box sx={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  p: 3, borderRadius: 6,
                  background: 'rgba(12, 24, 101, 0.85)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ p: 1.5, bgcolor: '#f97316', borderRadius: 4, display: 'flex' }}>
                      <RenderIcon icon={currentRoom.icon} />
                    </Box>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: "'Montserrat Alternates', sans-serif" }}>
                        {t(currentLocation) || currentRoom.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.7), fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                        {currentRoom.floor ? t(currentRoom.floor) : 'Liceum'} • {t("photo") || "Photo"} {currentImageIndex + 1}/{images.length}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Paper>

              {/* CONTENT DETAILS */}
              <Box sx={{ mt: 5, px: { xs: 1, md: 0 } }}>
                <Typography sx={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.8, mb: 4, fontWeight: 500 }}>
                  {t(`${currentLocation}Description`) || currentRoom.description}
                </Typography>

                <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 12, height: 32, bgcolor: '#f97316', borderRadius: 1 }} />
                  {t("keyFeatures") || "Key Features"}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {(t(`${currentLocation}Highlights`, { returnObjects: true }) || currentRoom.highlights).map((text, i) => (
                      <Paper key={i} sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <CenterFocusWeak sx={{ color: '#182BA1' }} />
                        <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{text}</Typography>
                      </Paper>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* SIDEBAR MAP SECTION */}
            <Box component="aside">
              <Paper sx={{
                p: 3, borderRadius: 8, bgcolor: alpha('#182BA1', 0.03), border: '1px solid #e2e8f0',
                position: 'sticky', top: 30, maxHeight: '90vh', overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 10 }
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <LocationOn sx={{ color: '#182BA1' }} />
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#0c1865' }}>{t("campusMap") || "CAMPUS MAP"}</Typography>
                </Stack>

                <Stack spacing={3}>
                  {[
                    ['entrance', 'foyer'],
                    ['rimc', 'library', 'gym', 'danceroom', 'medical'],
                    ['recreation', 'classroom1', 'classroom2'],
                    ['teacherspace', 'computerclass', 'middleschool'],
                    ['auditorium', 'cafeteria', 'orgoffice', 'languageroom'],
                    ['hallway3', 'chemistry', 'biology', 'physics', 'languageroom3'],
                    ['playground', 'courtyard']
                  ].map((group, idx) => (
                      <Box key={idx}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                          {group.map(id => (
                              <MapButton
                                  key={id} id={id}
                                  currentId={currentLocation}
                                  connections={currentRoom.connections}
                                  onClick={navigateTo}
                                  name={t(id) || locations[id]?.name}
                                  icon={locations[id]?.icon}
                              />
                          ))}
                        </Box>
                        {idx < 6 && <Divider sx={{ mt: 3, opacity: 0.5 }} />}
                      </Box>
                  ))}
                </Stack>

                {/* TIP BOX */}
                <Box sx={{ mt: 4, p: 3, bgcolor: '#fff', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <InfoOutlined sx={{ color: '#f97316' }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{t("explore") || "Quick Tip"}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 0.5 }}>
                        {t("clickMapTip") || "Click on highlighted rooms in the map to jump directly to that location."}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>
  );
};

export default VirtualTour;