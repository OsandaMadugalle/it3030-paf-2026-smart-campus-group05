import React, { useEffect, useMemo, useState } from 'react';
import { useIsMobile } from '../hooks/useWindowSize';
import { getAllFacilities } from '../services/facilityService';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const typeLabels = {
  hall: 'Lecture Hall',
  lab: 'Lab',
  sports: 'Sports',
  library: 'Library',
  cafeteria: 'Cafeteria',
  parking: 'Parking',
  dormitory: 'Dormitory',
  default: 'Facility',
};

const Facilities = () => {
  const isMobile = useIsMobile();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getAllFacilities(false);
        setFacilities(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Unable to load facilities at the moment. Please try again shortly.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const availableTypes = useMemo(() => {
    const values = Array.from(new Set(facilities.map((f) => f.type).filter(Boolean)));
    return values.sort();
  }, [facilities]);

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const text = `${facility.name || ''} ${facility.location || ''} ${facility.description || ''}`.toLowerCase();
      const matchesKeyword = text.includes(keyword.trim().toLowerCase());
      const matchesType = selectedType === 'all' || facility.type === selectedType;
      return matchesKeyword && matchesType;
    });
  }, [facilities, keyword, selectedType]);

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      fontFamily: "'Inter', sans-serif",
      color: '#0F172A',
    },
    hero: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '30px 16px 16px' : '54px 24px 20px',
    },
    title: {
      fontSize: isMobile ? '30px' : '44px',
      lineHeight: 1.1,
      fontWeight: 800,
      marginBottom: '12px',
    },
    subtitle: {
      fontSize: isMobile ? '15px' : '18px',
      color: '#475569',
      lineHeight: 1.7,
      maxWidth: '760px',
    },
    controls: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '14px 16px 8px' : '18px 24px 8px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
      gap: '12px',
    },
    input: {
      width: '100%',
      border: '1px solid #CBD5E1',
      borderRadius: '10px',
      padding: '11px 12px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#FFFFFF',
    },
    select: {
      width: '100%',
      border: '1px solid #CBD5E1',
      borderRadius: '10px',
      padding: '11px 12px',
      fontSize: '14px',
      outline: 'none',
      backgroundColor: '#FFFFFF',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '12px 16px 56px' : '20px 24px 80px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: isMobile ? '14px' : '18px',
    },
    card: {
      border: '1px solid #E2E8F0',
      borderRadius: '14px',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    imageWrap: {
      height: '150px',
      backgroundColor: '#E2E8F0',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#64748B',
      fontSize: '13px',
      fontWeight: 600,
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    typeTag: {
      position: 'absolute',
      right: '10px',
      top: '10px',
      backgroundColor: 'rgba(15, 23, 42, 0.78)',
      color: '#FFFFFF',
      borderRadius: '999px',
      padding: '5px 10px',
      fontSize: '11px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
    },
    body: {
      padding: '14px 14px 16px',
    },
    name: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#0F172A',
      marginBottom: '8px',
    },
    meta: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      fontSize: '13px',
      color: '#475569',
      marginBottom: '10px',
    },
    description: {
      margin: 0,
      fontSize: '13px',
      lineHeight: 1.65,
      color: '#64748B',
      minHeight: '60px',
    },
    empty: {
      border: '1px dashed #CBD5E1',
      borderRadius: '14px',
      padding: '34px 16px',
      textAlign: 'center',
      color: '#64748B',
      backgroundColor: '#FFFFFF',
    },
    helperText: {
      marginTop: '8px',
      fontSize: '13px',
      color: '#64748B',
    },
    errorBox: {
      border: '1px solid #FECACA',
      backgroundColor: '#FEF2F2',
      color: '#B91C1C',
      borderRadius: '10px',
      padding: '12px 14px',
      fontSize: '14px',
    },
    footer: {
      backgroundColor: '#0F172A',
      padding: isMobile ? '24px 16px' : '32px 48px',
      textAlign: 'center',
      color: '#64748B',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.page}>
      <PublicNavbar isMobile={isMobile} />

      <section style={styles.hero}>
        <h1 style={styles.title}>Facilities Catalog</h1>
        <p style={styles.subtitle}>
          Browse active campus facilities with live data from the operations system.
          Availability, capacity, and location details are synced from the database.
        </p>
      </section>

      <section style={styles.controls}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search by name, location, or description"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          style={styles.select}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {typeLabels[type] || type}
            </option>
          ))}
        </select>
      </section>

      <section style={styles.content}>
        {loading && <p style={styles.helperText}>Loading facilities...</p>}

        {!loading && error && <div style={styles.errorBox}>{error}</div>}
        {!loading && !error && filteredFacilities.length === 0 && (
          <div style={styles.empty}>
            No facilities match your current filters.
          </div>
        )}

        {!loading && !error && filteredFacilities.length > 0 && (
          <div style={styles.grid}>
            {filteredFacilities.map((facility) => (
              <article
                key={facility.id}
                style={styles.card}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.10)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 22px rgba(15, 23, 42, 0.06)';
                }}
              >
                <div style={styles.imageWrap}>
                  {facility.imageUrl ? (
                    <img src={facility.imageUrl} alt={facility.name} style={styles.image} />
                  ) : (
                    <span>No image available</span>
                  )}
                  <span style={styles.typeTag}>{typeLabels[facility.type] || 'Facility'}</span>
                </div>
                <div style={styles.body}>
                  <h2 style={styles.name}>{facility.name}</h2>
                  <div style={styles.meta}>
                    <span>Location: {facility.location || 'Not specified'}</span>
                    <span>Capacity: {facility.capacity || 0}</span>
                    <span>Status: {(facility.status || 'active').toUpperCase()}</span>
                  </div>
                  <p style={styles.description}>
                    {facility.description || 'No additional description provided for this facility.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PublicFooter isMobile={isMobile} />
    </div>
  );
};

export default Facilities;
