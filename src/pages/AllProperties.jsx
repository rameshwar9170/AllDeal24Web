import React, { useEffect, useState, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; // Assuming your firebase config is here
import { FaMapMarkerAlt, FaRupeeSign, FaHome, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const AllProperties = () => {
  const [allProperties, setAllProperties] = useState([]); // Stores all fetched properties
  const [displayedProperties, setDisplayedProperties] = useState([]); // Stores properties for current page
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30); // Default, will be updated based on screen size (10 rows for 3 columns)

  // Calculate items per page based on screen width
  const calculateItemsPerPage = useCallback(() => {
    if (window.innerWidth <= 600) {
      // Mobile (1 column) -> display 10 items per page (10 rows)
      return 5;
    } else if (window.innerWidth <= 992) {
      // Tablet (2 columns) -> display 20 items per page (10 rows)
      return 10;
    } else {
      // Desktop (3 columns) -> display 30 items per page (10 rows)
      return 15;
    }
  }, []);

  // Effect to fetch all properties from Firebase once
  useEffect(() => {
    const propertyRef = ref(database, "App/FeaturedItems/");

    const unsubscribe = onValue(propertyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data).map(([key, value]) => ({
          ...value,
          id: key,
        }));
        setAllProperties(items); // Store all properties
      } else {
        setAllProperties([]);
      }
      setLoading(false); // Data loaded (all of it)
    }, (error) => {
      // Added error handling for Firebase fetch
      console.error("Firebase data fetch failed:", error.message);
      setLoading(false);
      setAllProperties([]); // Clear properties on error
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []); // Empty dependency array: runs only once on mount

  // Effect to update itemsPerPage and reset page on resize
  useEffect(() => {
    const handleResize = () => {
      const newItemsPerPage = calculateItemsPerPage();
      if (newItemsPerPage !== itemsPerPage) {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page on layout change
      }
    };

    // Set initial items per page
    setItemsPerPage(calculateItemsPerPage());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateItemsPerPage, itemsPerPage]); // Depend on itemsPerPage to re-run if it changes

  // Effect to update displayed properties when allProperties or pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProperties(allProperties.slice(startIndex, endIndex));
  }, [allProperties, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allProperties.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Display loading message
  if (loading) {
    return <p className="loading">Loading properties...</p>;
  }

  // Display message if no properties are found after loading
  if (allProperties.length === 0) {
    return <p className="no-properties">No properties found in the database.</p>;
  }

  return (
    <div className="all-properties-container">
      <h2 className="section-heading">Find the best property for you!</h2>

      <div className="all-properties-grid">
        {displayedProperties.map((item) => (
          <Link to={`/property/${item.id}`} key={item.id} className="all-property-card">
            <div className="all-property-image-wrapper">
              <img
                src={item.imageUrls?.[0] || 'https://via.placeholder.com/400x250/F3F4F6/9CA3AF?text=No+Image'}
                alt={item.featuredHeading || 'Property'}
                className="all-property-image"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x250/F3F4F6/9CA3AF?text=Image+Error'; }}
              />
              <span className="all-property-badge">{item.propertyType}</span>
            </div>

            <div className="all-property-content">
              <h3 className="all-property-heading">{item.featuredHeading}</h3>

              <div className="all-property-info-group">
                <div className="all-property-info-line">
                  <FaHome className="all-property-icon" />
                  <span>{item.flatType}</span>
                </div>

                <div className="all-property-info-line">
                  <FaMapMarkerAlt className="all-property-icon" />
                  <span>{item.featuredProductLocation}</span>
                </div>
              </div>

              <div className="all-property-price">
                <FaRupeeSign className="all-property-price-icon" />
                <span>{item.featuredPrice}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && ( // Only show pagination if there's more than one page
        <div className="pagination-controls">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <FaChevronLeft /> Previous
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* Embedded Styles (unchanged from previous version for aesthetics) */}
      <style>{`
        .section-heading {
          text-align: center;
          font-size: 32px;
          font-weight: 700;
          color: #1a202c;
          margin: 60px 0 40px 0;
          letter-spacing: -0.8px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
        }

        .loading, .no-properties {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
          font-family: 'Poppins', sans-serif;
        }

        .no-properties {
          color: #d32f2f;
        }

        .all-properties-container {
          
          min-height: 100vh;
          font-family: 'Poppins', sans-serif;
        }

        .all-properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          padding: 0;
        }

        .all-property-card {
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          position: relative;
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .all-property-card:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
          filter: brightness(1.05);
        }

        .all-property-image-wrapper {
          width: 100%;
          height: 230px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #ebf4ff;
        }

        .all-property-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .all-property-card:hover .all-property-image {
          transform: scale(1.1);
        }

        .all-property-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          background: linear-gradient(45deg, #FF6B6B, #FFD166);
          color: #fff;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.7px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
          z-index: 1;
        }

        .all-property-content {
          padding: 25px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .all-property-heading {
          font-size: 22px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 18px;
          line-height: 1.4;
          text-shadow: 0.5px 0.5px 1px rgba(0,0,0,0.03);
        }

        .all-property-info-group {
          margin-bottom: 20px;
        }

        .all-property-info-line {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          font-size: 16px;
          color: #4a5568;
        }

        .all-property-icon {
          margin-right: 12px;
          color: #4299e1;
          font-size: 19px;
        }

        .all-property-price {
          display: flex;
          align-items: center;
          font-size: 26px;
          font-weight: 800;
          color: #228b22;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px dashed #e0e0e0;
        }

        .all-property-price-icon {
          margin-right: 10px;
          font-size: 22px;
        }

        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin-top: 50px;
        }

        .pagination-button {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: #fff;
          border: none;
          padding: 15px 30px;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .pagination-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 25px rgba(0,0,0,0.25);
        }

        .pagination-button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          opacity: 0.7;
          box-shadow: none;
        }

        .page-info {
          font-size: 18px;
          font-weight: 500;
          color: #333;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .section-heading {
            font-size: 28px;
          }
          .all-properties-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
          }
        }

        @media (max-width: 992px) {
          .section-heading {
            font-size: 26px;
            margin-top: 50px;
            margin-bottom: 30px;
          }
          .all-properties-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
            padding: 0 15px;
          }
        }

        @media (max-width: 768px) {
          .section-heading {
            font-size: 24px;
            margin-top: 40px;
            margin-bottom: 25px;
          }
          .all-properties-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 600px) {
          .section-heading {
            font-size: 22px;
            margin-top: 30px;
            margin-bottom: 20px;
            padding: 0 10px;
          }
          .all-properties-grid {
            grid-template-columns: 1fr; /* Single column on small screens */
            padding: 0 10px;
          }
          .all-property-card {
            max-width: 90%;
            margin: 0 auto;
          }
          .pagination-button {
            padding: 12px 25px;
            font-size: 16px;
          }
          .page-info {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default AllProperties;