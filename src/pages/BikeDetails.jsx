import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { FaMapMarkerAlt, FaRupeeSign, FaTrash, FaArrowLeft } from "react-icons/fa";

const BikeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState(null);
  const [relatedBikes, setRelatedBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current bike details
    const bikeRef = ref(database, `Bikes/${id}`);
    onValue(bikeRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBike({ id, ...data });
        console.log("Current bike:", { id, ...data });
      } else {
        setBike(null);
        console.warn("No bike found for ID:", id);
      }
      setLoading(false);
    });

    // Fetch all bikes for related items
    const bikesRef = ref(database, "Bikes/");
    onValue(bikesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bikesArray = Object.entries(data).map(([bikeId, bikeData]) => ({
          id: bikeId,
          ...bikeData,
        }));
        console.log("All bikes:", bikesArray);
        // Filter related bikes
        setRelatedBikes(filterRelatedBikes(bikesArray, bike, id));
      } else {
        setRelatedBikes([]);
        console.warn("No bikes found in Bikes/ collection");
      }
    });
  }, [id, bike]);

  const filterRelatedBikes = (bikes, currentBike, currentId) => {
    if (!currentBike) return [];
    
    // Extract brand from bikeModel if brand field doesn't exist
    const getBrand = (model) => {
      if (!model) return "";
      const words = model.split(" ");
      return words[0]?.toLowerCase() || ""; // Fallback to empty string
    };

    const currentBrand = currentBike.brand?.toLowerCase() || getBrand(currentBike.bikeModel);
    const currentPrice = parseFloat(currentBike.bikePrice) || 0;
    const priceRange = {
      min: currentPrice * 0.8, // ±20%
      max: currentPrice * 1.2,
    };

    let related = bikes
      .filter((b) => b.id !== currentId) // Exclude current bike
      .filter((b) => {
        const bikeBrand = b.brand?.toLowerCase() || getBrand(b.bikeModel);
        const bikePrice = parseFloat(b.bikePrice) || 0;
        // Match by brand or price range
        return bikeBrand === currentBrand || (bikePrice >= priceRange.min && bikePrice <= priceRange.max);
      })
      .slice(0, 10); // Limit to 10

    // Fallback: If no matches, show other bikes (up to 10)
    if (related.length === 0) {
      related = bikes
        .filter((b) => b.id !== currentId)
        .slice(0, 10);
    }

    console.log("Related bikes:", related);
    return related;
  };

  

  const handleBikeClick = (bikeId) => {
    navigate(`/bike/${bikeId}`);
  };

  if (loading) {
    return <div className="loading">Loading bike details...</div>;
  }

  if (!bike) {
    return <div className="error">Bike not found</div>;
  }

  return (
    <div style={styles.page}>
      <button
        style={styles.backButton}
        onClick={() => navigate("/manage-bikes")}
      >
        <FaArrowLeft style={styles.icon} /> Back to Bikes
      </button>
      <div style={styles.bikeDetails}>
        <h2 style={styles.bikeTitle}>{bike.bikeModel}</h2>
        <img
          src={bike.bikeImages?.[0] || "path/to/fallback-image.jpg"}
          alt={bike.bikeModel}
          style={styles.bikeImage}
        />
        <div style={styles.bikeInfo}>
          <p style={styles.bikeInfoLine}>
            <FaMapMarkerAlt style={styles.icon} /> <strong>Location:</strong> {bike.bikeLocation}
          </p>
          <p style={styles.bikeInfoLine}>
            <FaRupeeSign style={styles.icon} /> <strong>Price:</strong> ₹{bike.bikePrice}
          </p>
          {bike.bikeDescription && (
            <p style={styles.bikeInfoLine}>
              <strong>Description:</strong> {bike.bikeDescription}
            </p>
          )}
          {bike.bikeYear && (
            <p style={styles.bikeInfoLine}>
              <strong>Year:</strong> {bike.bikeYear}
            </p>
          )}
          {bike.postedTime && (
            <p style={styles.bikeInfoLine}>
              <strong>Posted:</strong>{" "}
              {new Date(bike.postedTime).toLocaleDateString()}
            </p>
          )}
        </div>
       
      </div>

      <div style={styles.relatedSection}>
        <h3 style={styles.relatedTitle}>Related Bikes</h3>
        {relatedBikes.length === 0 ? (
          <div className="no-related">No related bikes found</div>
        ) : (
          <div className="card-grid">
            {relatedBikes.map((relatedBike) => (
              <div
                key={relatedBike.id}
                className="card-hover"
                style={styles.card}
                onClick={() => handleBikeClick(relatedBike.id)}
              >
                <img
                  src={relatedBike.bikeImages?.[0] || "path/to/fallback-image.jpg"}
                  alt={relatedBike.bikeModel}
                  style={styles.image}
                />
                <h3 style={styles.cardTitle}>{relatedBike.bikeModel}</h3>
                <div style={styles.cardLine}>
                  <FaMapMarkerAlt style={styles.icon} /> {relatedBike.bikeLocation}
                </div>
                <div style={styles.cardLine}>
                  <FaRupeeSign style={styles.icon} /> ₹{relatedBike.bikePrice}
                </div>
                
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
        }

        .error {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #d32f2f;
        }

        .no-related {
          text-align: center;
          font-size: 16px;
          margin-top: 20px;
          color: #555;
        }

       

      

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        @media (max-width: 500px) {
          .card-grid {
            grid-template-columns: 1fr !important;
          }
        }

        .card-hover {
          border: 2px solid transparent;
          background: linear-gradient(#fff, #fff) padding-box,
                      linear-gradient(135deg, #0d47a1, #42a5f5) border-box;
          transition: all 0.3s ease;
          position: relative;
          cursor: pointer;
        }

        .card-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(13, 71, 161, 0.3);
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "1px solid #0d47a1",
    color: "#0d47a1",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    marginBottom: "20px",
    transition: "all 0.3s ease",
  },
  bikeDetails: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    maxWidth: "600px",
    margin: "0 auto 30px",
  },
  bikeTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0d47a1",
    marginBottom: "15px",
  },
  bikeImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  bikeInfo: {
    fontSize: "14px",
  },
  bikeInfoLine: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  relatedSection: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  relatedTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0d47a1",
    marginBottom: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
    fontSize: "14px",
  },
  cardTitle: {
    margin: "10px 0 6px",
    color: "#0d47a1",
    fontSize: "16px",
    fontWeight: "600",
  },
  cardLine: {
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    fontSize: "13.5px",
  },
  icon: {
    marginRight: "8px",
    color: "#0d47a1",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "8px",
  },
};

export default BikeDetails;