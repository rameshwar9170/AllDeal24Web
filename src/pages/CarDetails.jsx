import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database"; // Added query, orderByChild, equalTo
import { database } from "../firebase";
import { FaMapMarkerAlt, FaRupeeSign, FaArrowLeft } from "react-icons/fa";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the current car
  useEffect(() => {
    const carRef = ref(database, `Cars/${id}`);
    const unsubscribe = onValue(carRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCar({ id, ...data });
      } else {
        setCar(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  // Fetch related cars (cars from the same location, excluding the current car)
  useEffect(() => {
    if (car) {
      // CORRECTED LINE: Using query, orderByChild, and equalTo
      const relatedCarsRef = query(
        ref(database, 'Cars'),
        orderByChild('carLocation'),
        equalTo(car.carLocation)
      );
      const unsubscribe = onValue(relatedCarsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const relatedCarsArray = Object.entries(data)
            .map(([relatedId, relatedCar]) => ({ id: relatedId, ...relatedCar }))
            .filter(related => related.id !== car.id);
          setRelatedCars(relatedCarsArray);
        } else {
          setRelatedCars([]);
        }
      });
      return () => unsubscribe();
    }
  }, [car]);

  if (loading) {
    return <div className="loading">Loading car details...</div>;
  }

  if (!car) {
    return <div className="error">Car not found</div>;
  }

  return (
    <div style={styles.page}>
      <button
        style={styles.backButton}
        onClick={() => navigate("/manage-cars")}
      >
        <FaArrowLeft style={styles.icon} /> Back to Cars
      </button>
      <div style={styles.carDetails}>
        <h2 style={styles.carTitle}>{car.carTitle}</h2>
        <img
          src={car.carImages?.[0] || "path/to/fallback-image.jpg"}
          alt={car.carTitle}
          style={styles.carImage}
        />
        <div style={styles.carInfo}>
          <p style={styles.carInfoLine}>
            <FaMapMarkerAlt style={styles.icon} /> <strong>Location:</strong> {car.carLocation}
          </p>
          <p style={styles.carInfoLine}>
            <FaRupeeSign style={styles.icon} /> <strong>Price:</strong> ₹{car.carPrice}
          </p>
          {car.carDescription && (
            <p style={styles.carInfoLine}>
              <strong>Description:</strong> {car.carDescription}
            </p>
          )}
          {car.carModel && (
            <p style={styles.carInfoLine}>
              <strong>Model:</strong> {car.carModel}
            </p>
          )}
          {car.carYear && (
            <p style={styles.carInfoLine}>
              <strong>Year:</strong> {car.carYear}
            </p>
          )}
          {car.postedTime && (
            <p style={styles.carInfoLine}>
              <strong>Posted:</strong> {new Date(car.postedTime).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {relatedCars.length > 0 && (
        <div>
          <h3 style={styles.relatedTitle}>Related Cars</h3>
          <div style={styles.relatedGrid}>
            {relatedCars.slice(0, 10).map((relatedCar) => (
              <div
                key={relatedCar.id}
                style={styles.relatedCard}
                onClick={() => navigate(`/cars/${relatedCar.id}`)}
              >
                <img src={relatedCar.carImages?.[0]} alt={relatedCar.carTitle} style={styles.relatedImage} />
                <h4 style={styles.relatedCardTitle}>{relatedCar.carTitle}</h4>
                <div style={styles.relatedCardLine}>
                  <FaRupeeSign style={styles.icon} /> ₹{relatedCar.carPrice}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
  carDetails: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  carTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0d47a1",
    marginBottom: "15px",
  },
  carImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  carInfo: {
    fontSize: "14px",
  },
  carInfoLine: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  icon: {
    marginRight: "8px",
    color: "#0d47a1",
  },
  relatedTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0d47a1",
    marginTop: "30px",
  },
  relatedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },
  relatedCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px 16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  relatedImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "8px",
  },
  relatedCardTitle: {
    margin: "8px 0 4px",
    color: "#0d47a1",
    fontSize: "14px",
    fontWeight: "600",
  },
  relatedCardLine: {
    display: "flex",
    alignItems: "center",
    fontSize: "12px",
  },
};

export default CarDetails;