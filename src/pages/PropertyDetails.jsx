import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import { database } from "../firebase";
import { 
  FaMapMarkerAlt, FaRupeeSign, FaHome, FaBuilding, FaParking, 
  FaPhone, FaWhatsapp, FaCouch, FaCheck, FaRulerCombined,
  FaAngleLeft, FaAngleRight, FaBed, FaBath, FaShareAlt, FaHeart,
  FaStar, FaExpand
} from "react-icons/fa";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(true);

  // Fetch property details
  useEffect(() => {
    const propertyRef = ref(database, `App/FeaturedItems/${id}`);
    onValue(propertyRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        setProperty({ id, ...data });
        fetchSimilarProperties(data.propertyType, id);
      } else {
        setProperty(null);
      }
      setLoading(false);
    });
  }, [id]);

  // Fetch similar properties
  const fetchSimilarProperties = (propertyType, currentId) => {
    const propertiesRef = ref(database, "App/FeaturedItems");
    onValue(propertiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const similar = Object.entries(data)
          .filter(([key, item]) => 
            item.propertyType === propertyType && key !== currentId
          )
          .map(([key, value]) => ({ ...value, id: key }));
        
        setSimilarProperties(similar);
      } else {
        setSimilarProperties([]);
      }
      setLoadingSimilar(false);
    });
  };

  const nextImage = () => {
    setCurrentImage(prev => 
      prev === property.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImage(prev => 
      prev === 0 ? property.imageUrls.length - 1 : prev - 1
    );
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.featuredHeading,
        text: `Check out this property: ${property.featuredHeading}`,
        url: window.location.href,
      })
      .catch(console.error);
    } else {
      alert("Sharing is not supported in your browser. Copy this URL: " + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="not-found">
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties" className="back-btn">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="property-details-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / 
        <Link to="/properties">Properties</Link> / 
        <span>{property.featuredHeading}</span>
      </div>
      
      {/* Property Header */}
      <div className="property-header">
        <div>
          <h1>{property.featuredHeading}</h1>
          <div className="location">
            <FaMapMarkerAlt />
            <span>{property.featuredProductLocation}</span>
          </div>
        </div>
        <div className="property-actions">
          <button 
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
          >
            <FaHeart />
            <span>{isFavorite ? 'Saved' : 'Save'}</span>
          </button>
          <button className="share-btn" onClick={handleShare}>
            <FaShareAlt />
            <span>Share</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="property-content">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-container">
            {property.imageUrls && property.imageUrls.length > 0 ? (
              <div className="main-image-wrapper">
                <img
                  src={property.imageUrls[currentImage]}
                  alt={`Property ${currentImage + 1}`}
                  className="main-image"
                  onClick={() => setShowLightbox(true)}
                />
                <button className="nav-btn prev-btn" onClick={prevImage}>
                  <FaAngleLeft />
                </button>
                <button className="nav-btn next-btn" onClick={nextImage}>
                  <FaAngleRight />
                </button>
                <button 
                  className="expand-btn"
                  onClick={() => setShowLightbox(true)}
                >
                  <FaExpand />
                </button>
                <div className="image-counter">
                  {currentImage + 1} / {property.imageUrls.length}
                </div>
              </div>
            ) : (
              <div className="no-image-placeholder">
                <FaHome className="placeholder-icon" />
                <p>No images available</p>
              </div>
            )}
          </div>
          
          {property.imageUrls && property.imageUrls.length > 1 && (
            <div className="thumbnails">
              {property.imageUrls.map((url, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  onClick={() => setCurrentImage(index)}
                >
                  <img src={url} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Property Details */}
        <div className="property-details">
          <div className="price-section">
            <div className="price">
              <FaRupeeSign />
              <span>{property.featuredPrice}</span>
            </div>
            <div className="property-badge">{property.propertyType}</div>
          </div>
          
          <div className="key-details">
            <div className="detail-item">
              <FaRulerCombined />
              <span>{property.area || "N/A"} sq.ft.</span>
            </div>
            <div className="detail-item">
              <FaHome />
              <span>{property.flatType || "N/A"}</span>
            </div>
            <div className="detail-item">
              <FaBed />
              <span>{property.bedrooms || "N/A"} Beds</span>
            </div>
            <div className="detail-item">
              <FaBath />
              <span>{property.bathrooms || "N/A"} Baths</span>
            </div>
          </div>
          
          <div className="description">
            <h3>Description</h3>
            <p>{property.featuredDesc || "No description available for this property."}</p>
          </div>
          
          <div className="features">
            <h3>Features</h3>
            <div className="features-grid">
              <div className="feature">
                <FaCouch />
                <span>Furniture: {property.furnitureAvailable || "N/A"}</span>
              </div>
              <div className="feature">
                <FaCheck />
                <span>Lift: {property.liftAvailable || "N/A"}</span>
              </div>
              <div className="feature">
                <FaParking />
                <span>Parking: {property.parking || "N/A"}</span>
              </div>
              <div className="feature">
                <FaBuilding />
                <span>Project: {property.projectName || "N/A"}</span>
              </div>
              <div className="feature">
                <span>Bathroom: {property.bathroomType || "N/A"}</span>
              </div>
              <div className="feature">
                <span>Owner: {property.ownerType || "N/A"}</span>
              </div>
            </div>
          </div>
          
          <div className="contact-section">
            <h3>Contact Information</h3>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone />
                <div>
                  <span>Phone</span>
                  <a href={`tel:${property.phoneNo}`}>{property.phoneNo || "N/A"}</a>
                </div>
              </div>
              <div className="contact-item">
                <FaWhatsapp />
                <div>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${property.whatsappNumber}`} target="_blank" rel="noreferrer">
                    {property.whatsappNumber || "N/A"}
                  </a>
                </div>
              </div>
            </div>
            <button className="inquiry-btn">Send Inquiry</button>
          </div>
        </div>
      </div>
      
      {/* Additional Info */}
      <div className="additional-info">
        <div className="info-card">
          <h3>Property Rules</h3>
          <ul>
            <li>Bachelors Allowed: {property.bachelorsAllowed || "N/A"}</li>
            <li>Families Allowed: {property.familiesAllowed || "N/A"}</li>
            <li>No smoking inside the property</li>
            <li>Pets allowed with additional deposit</li>
          </ul>
        </div>
        
        <div className="info-card">
          <h3>Neighborhood</h3>
          <div className="ratings">
            <div className="rating-item">
              <span>Safety</span>
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
            <div className="rating-item">
              <span>Transport</span>
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
            <div className="rating-item">
              <span>Amenities</span>
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
            </div>
          </div>
          <p>Located in a prime area with shopping malls, restaurants, and public transport within walking distance.</p>
        </div>
      </div>
      
      {/* Similar Properties */}
      <div className="similar-properties">
        <h2>Similar Properties</h2>
        
        {loadingSimilar ? (
          <div className="loading-similar">
            <div className="spinner small"></div>
            <p>Loading similar properties...</p>
          </div>
        ) : similarProperties.length === 0 ? (
          <p className="no-similar">No similar properties found</p>
        ) : (
          <div className="properties-grid">
            {similarProperties.slice(0, 3).map((property) => (
              <Link to={`/property/${property.id}`} key={property.id} className="property-card">
                <div className="property-image-container">
                  <img 
                    src={property.imageUrls?.[0] || "https://placehold.co/600x400/cccccc/333333?text=No+Image"} 
                    alt={property.featuredHeading} 
                  />
                </div>
                <div className="property-info">
                  <h4>{property.featuredHeading}</h4>
                  <div className="price">
                    <FaRupeeSign />
                    <span>{property.featuredPrice}</span>
                  </div>
                  <div className="location">
                    <FaMapMarkerAlt />
                    <span>{property.featuredProductLocation}</span>
                  </div>
                  <div className="features">
                    <span><FaHome /> {property.flatType}</span>
                    <span><FaRulerCombined /> {property.area || "N/A"} sq.ft.</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      {/* Back to Properties */}
      <div className="back-container">
        <Link to="/properties" className="back-btn">
          Back to Properties
        </Link>
      </div>
      
      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="lightbox" onClick={() => setShowLightbox(false)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLightbox(false)}>
              &times;
            </button>
            <img 
              src={property.imageUrls[currentImage]} 
              alt="Property" 
              className="lightbox-image"
            />
            <button className="nav-btn prev-btn" onClick={prevImage}>
              <FaAngleLeft />
            </button>
            <button className="nav-btn next-btn" onClick={nextImage}>
              <FaAngleRight />
            </button>
          </div>
        </div>
      )}
      
      {/* Embedded CSS */}
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1e3a8a;
          --secondary: #f97316;
          --text: #1f2937;
          --text-light: #6b7280;
          --border: #e5e7eb;
          --bg-light: #f8fafc;
          --success: #10b981;
          --danger: #ef4444;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: var(--text);
          line-height: 1.6;
          background-color: #f9fafb;
        }
        
        .property-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .breadcrumb {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          color: var(--text-light);
          font-size: 14px;
        }
        
        .breadcrumb a {
          color: var(--primary);
          text-decoration: none;
        }
        
        .breadcrumb a:hover {
          text-decoration: underline;
        }
        
        .property-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        
        .property-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text);
        }
        
        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-light);
          font-size: 16px;
        }
        
        .property-actions {
          display: flex;
          gap: 12px;
        }
        
        .favorite-btn, .share-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .favorite-btn:hover, .share-btn:hover {
          background: var(--bg-light);
        }
        
        .favorite-btn.active {
          background: #fff1f2;
          border-color: #fecdd3;
          color: #e11d48;
        }
        
        .favorite-btn.active svg {
          fill: #e11d48;
        }
        
        .property-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }
        
        @media (min-width: 992px) {
          .property-content {
            grid-template-columns: 1.5fr 1fr;
          }
        }
        
        .image-gallery {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow);
        }
        
        .main-image-container {
          position: relative;
          aspect-ratio: 16/9;
          background-color: #f3f4f6;
        }
        
        .main-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .main-image:hover {
          transform: scale(1.02);
        }
        
        .no-image-placeholder {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background-color: #e5e7eb;
          color: #6b7280;
        }
        
        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .nav-btn:hover {
          background: white;
          transform: translateY(-50%) scale(1.05);
        }
        
        .prev-btn {
          left: 20px;
        }
        
        .next-btn {
          right: 20px;
        }
        
        .image-counter {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
        }
        
        .expand-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.8);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .expand-btn:hover {
          background: white;
        }
        
        .thumbnails {
          display: flex;
          gap: 8px;
          padding: 12px;
          overflow-x: auto;
          background: white;
        }
        
        .thumbnail {
          flex: 0 0 auto;
          width: 80px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }
        
        .thumbnail:hover, .thumbnail.active {
          border-color: var(--primary);
        }
        
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .property-details {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .price {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
        }
        
        .property-badge {
          background: #dbeafe;
          color: var(--primary-dark);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .key-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border);
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
        }
        
        .detail-item svg {
          color: var(--primary);
        }
        
        .description h3, 
        .features h3,
        .contact-section h3 {
          font-size: 18px;
          margin-bottom: 16px;
          color: var(--text);
        }
        
        .description p {
          margin-bottom: 24px;
          color: var(--text-light);
          line-height: 1.8;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
        }
        
        .contact-section {
          background: var(--bg-light);
          padding: 20px;
          border-radius: 10px;
        }
        
        .contact-info {
          margin-bottom: 20px;
        }
        
        .contact-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .contact-item svg {
          color: var(--primary);
          font-size: 20px;
          margin-top: 4px;
        }
        
        .contact-item div {
          display: flex;
          flex-direction: column;
        }
        
        .contact-item span {
          font-size: 14px;
          color: var(--text-light);
        }
        
        .contact-item a {
          color: var(--text);
          font-weight: 500;
          text-decoration: none;
        }
        
        .contact-item a:hover {
          text-decoration: underline;
          color: var(--primary);
        }
        
        .inquiry-btn {
          width: 100%;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .inquiry-btn:hover {
          background: var(--primary-dark);
        }
        
        .additional-info {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 40px;
        }
        
        @media (min-width: 768px) {
          .additional-info {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .info-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: var(--shadow);
        }
        
        .info-card h3 {
          font-size: 18px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        
        .info-card ul {
          padding-left: 20px;
        }
        
        .info-card li {
          margin-bottom: 8px;
        }
        
        .ratings {
          margin-bottom: 16px;
        }
        
        .rating-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        
        .stars {
          color: #f59e0b;
        }
        
        .similar-properties {
          margin-bottom: 40px;
        }
        
        .similar-properties h2 {
          font-size: 22px;
          margin-bottom: 20px;
        }
        
        .loading-similar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 30px;
        }
        
        .no-similar {
          text-align: center;
          padding: 30px;
          color: var(--text-light);
        }
        
        .properties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .property-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
          text-decoration: none;
          color: inherit;
        }
        
        .property-card:hover {
          transform: translateY(-5px);
        }
        
        .property-image-container {
          height: 200px;
          overflow: hidden;
        }
        
        .property-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .property-card:hover .property-image-container img {
          transform: scale(1.05);
        }
        
        .property-info {
          padding: 16px;
        }
        
        .property-info h4 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        
        .price {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .location {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-light);
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .features {
          display: flex;
          gap: 16px;
          font-size: 14px;
          color: var(--text-light);
        }
        
        .back-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        
        .back-btn {
          display: inline-flex;
          align-items: center;
          padding: 10px 24px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        
        .back-btn:hover {
          background: var(--primary-dark);
        }
        
        .lightbox {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .lightbox-content {
          position: relative;
          max-width: 90%;
          max-height: 90%;
        }
        
        .lightbox-image {
          max-width: 100%;
          max-height: 80vh;
          object-fit: contain;
        }
        
        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          color: white;
          font-size: 30px;
          cursor: pointer;
        }
        
        .lightbox .nav-btn {
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }
        
        .lightbox .nav-btn:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 20px;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(37, 99, 235, 0.2);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 1s linear infinite;
        }
        
        .spinner.small {
          width: 30px;
          height: 30px;
          border-width: 3px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .not-found {
          text-align: center;
          padding: 60px 20px;
        }
        
        .not-found h2 {
          font-size: 24px;
          margin-bottom: 16px;
          color: var(--text);
        }
        
        .not-found p {
          margin-bottom: 24px;
          color: var(--text-light);
        }
        
        @media (max-width: 768px) {
          .property-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .property-actions {
            width: 100%;
            justify-content: flex-start;
          }
          
          .property-header h1 {
            font-size: 24px;
          }
          
          .key-details {
            grid-template-columns: 1fr;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default PropertyDetails;