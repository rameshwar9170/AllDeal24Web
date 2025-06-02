import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database"; // Removed 'remove'
import { database } from "../firebase"; // Assuming your firebase config is here
import { FaMapMarkerAlt, FaRupeeSign, FaHome } from "react-icons/fa"; // Removed FaTrash
import { Link } from "react-router-dom"; // Keep Link for navigation

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the 'FeaturedItems' path in your Firebase Realtime Database
    const propertyRef = ref(database, "App/FeaturedItems/");

    // Set up a listener for real-time data changes
    onValue(propertyRef, (snapshot) => {
      const data = snapshot.val(); // Get the data from the snapshot
      if (data) {
        // Convert the object of properties into an array, adding the Firebase key as 'id'
        const items = Object.entries(data).map(([key, value]) => ({
          ...value, // Spread existing property data
          id: key,   // Add the unique Firebase key as 'id'
        }));
        setProperties(items); // Update the state with the fetched properties
      } else {
        setProperties([]); // If no data, set properties to an empty array
      }
      setLoading(false); // Set loading to false once data is fetched or determined empty
    });
  }, []); // Empty dependency array means this effect runs once on component mount

  // Display loading message while data is being fetched
  if (loading) {
    return <p className="loading">Loading all properties...</p>;
  }

  // Display message if no properties are found after loading
  if (properties.length === 0) {
    return <p className="loading">No properties found in the database.</p>;
  }

  return (
    <div className="property-container">
      <div className="property-header">
        <h2 className="property-title">All Properties</h2>
        <p className="property-count">Total Properties: {properties.length}</p>
      </div>

      <div className="property-grid">
        {properties.map((item) => (
          // Wrap the entire property card with the Link component
          // The 'to' prop defines the navigation path, including the property's unique ID
          <Link to={`/property/${item.id}`} key={item.id} className="property-card">
            {/* Property Image */}
            <img
              src={item.imageUrls?.[0] || 'https://placehold.co/400x200/cccccc/333333?text=No+Image'}
              alt="Property"
              className="property-image"
              // Fallback for broken images
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x200/cccccc/333333?text=Image+Error'; }}
            />

            {/* Property Heading */}
            <h3 className="property-heading">{item.featuredHeading}</h3>

            {/* Property Details - Flat Type */}
            <div className="property-info">
              <FaHome />
              <span>{item.flatType}</span>
            </div>

            {/* Property Details - Location */}
            <div className="property-info">
              <FaMapMarkerAlt />
              <span>{item.featuredProductLocation}</span>
            </div>

            {/* Property Details - Price */}
            <div className="property-info">
              <FaRupeeSign />
              <span>{item.featuredPrice}</span>
            </div>

            {/* Property Type Badge */}
            <span className="property-badge">{item.propertyType}</span>
          </Link> // End of Link component
        ))}
      </div>

      {/* Embedded Styles for the Properties List */}
      <style>{`
        .property-container {
          padding-bottom: 40px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
        }

        .property-header {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          padding: 8px 20px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          border-radius: 0 0 12px 12px;
        }

        .property-title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .property-count {
          font-size: 16px;
          color: #e0e7ff;
        }

        .property-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          padding: 30px 20px;
        }

        /* Styling for the Link component acting as a card */
        .property-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          padding: 16px;
          cursor: pointer;
          display: flex; /* Use flexbox for internal layout */
          flex-direction: column; /* Stack items vertically */
          overflow: hidden;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none; /* Remove underline from Link */
          color: inherit; /* Inherit text color */
        }

        .property-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
        }

        .property-image {
          width: 100%;
          height: 190px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 12px;
        }

        .property-heading {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 10px;
        }

        .property-info {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-size: 14px;
          color: #374151;
        }

        .property-info svg {
          margin-right: 8px;
          color: #2563eb;
        }

        .property-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: #2563eb;
          color: #fff;
          padding: 5px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 500;
        }

        /* Responsive adjustments */
        @media (max-width: 992px) {
          .property-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .property-grid {
            grid-template-columns: 1fr;
          }

          .property-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .property-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default Properties;
