import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase"; // Assuming your firebase config is here
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaCalendarAlt,
  FaCar,
  FaRegListAlt,
  FaInfoCircle,
  FaPhone,
  FaUser,
} from "react-icons/fa";

const CommVehicleDetails = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Vehicle ID not provided.");
      setLoading(false);
      return;
    }

    const vehicleRef = ref(database, `CommVehicals/${id}`);
    const unsubscribe = onValue(
      vehicleRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setVehicle({ id, ...data });
          setLoading(false);
        } else {
          setError("Vehicle not found.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Error fetching vehicle details:", err);
        setError("Failed to load vehicle details.");
        setLoading(false);
      }
    );

    // Cleanup function to detach the listener when the component unmounts
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return <div style={styles.loading}>Loading commercial vehicle details...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  if (!vehicle) {
    return <div style={styles.notFound}>Vehicle details not found.</div>;
  }

  // Helper function to format the posted time
  const formatPostDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>{vehicle.carTitle}</h2>
      </div>

      <div style={styles.detailsContainer}>
        {vehicle.carImages && vehicle.carImages.length > 0 && (
          <div style={styles.imageGallery}>
            {vehicle.carImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${vehicle.carTitle} ${index + 1}`}
                style={styles.mainImage}
              />
            ))}
          </div>
        )}

        <div style={styles.infoSection}>
          <p style={styles.infoLine}>
            <FaRupeeSign style={styles.icon} /> Price: ₹{vehicle.carPrice}
          </p>
          <p style={styles.infoLine}>
            <FaMapMarkerAlt style={styles.icon} /> Location:{" "}
            {vehicle.carLocation}
          </p>
          <p style={styles.infoLine}>
            <FaCar style={styles.icon} /> Make: {vehicle.carMake || "N/A"}
          </p>
          <p style={styles.infoLine}>
            <FaCar style={styles.icon} /> Model: {vehicle.carModel || "N/A"}
          </p>
          <p style={styles.infoLine}>
            <FaCalendarAlt style={styles.icon} /> Year: {vehicle.carYear || "N/A"}
          </p>
          <p style={styles.infoLine}>
            <FaRegListAlt style={styles.icon} /> Category:{" "}
            {vehicle.carCategory || "N/A"}
          </p>
          <p style={styles.infoLine}>
            <FaInfoCircle style={styles.icon} /> Description:{" "}
            {vehicle.carDescription || "No description provided."}
          </p>
          <p style={styles.infoLine}>
            <FaCalendarAlt style={styles.icon} /> Posted On:{" "}
            {formatPostDate(vehicle.postedTime)}
          </p>

          <div style={styles.contactSection}>
            <h3 style={styles.contactTitle}>Contact Details</h3>
            <p style={styles.infoLine}>
              <FaUser style={styles.icon} /> Posted By: {vehicle.postedBy || "N/A"}
            </p>
            <p style={styles.infoLine}>
              <FaPhone style={styles.icon} /> Phone: {vehicle.contactNumber || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    padding: "20px",
    fontFamily: "Poppins, sans-serif",
    color: "#333",
    maxWidth: "900px",
    margin: "20px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
    color: "#d32f2f",
    fontWeight: "bold",
  },
  notFound: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "50px",
    color: "#777",
  },
  header: {
    textAlign: "center",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0d47a1",
    margin: "0",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  imageGallery: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  mainImage: {
    width: "100%",
    maxWidth: "600px",
    height: "auto",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  infoSection: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  infoLine: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "16px",
    color: "#444",
  },
  icon: {
    marginRight: "12px",
    color: "#0d47a1",
    fontSize: "18px",
  },
  contactSection: {
    marginTop: "25px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
  contactTitle: {
    fontSize: "22px",
    color: "#0d47a1",
    marginBottom: "15px",
    fontWeight: "600",
  },
};

export default CommVehicleDetails;