import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { FaRupeeSign, FaArrowLeft } from "react-icons/fa";

const PhoneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(null);
  const [relatedPhones, setRelatedPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current phone details
    const phoneRef = ref(database, `Phones/${id}`);
    onValue(phoneRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPhone({ id, ...data });
        console.log("Phone fetched:", { id, ...data });
      } else {
        setPhone(null);
        console.warn("No phone found for ID:", id);
      }
      setLoading(false);
    });

    // Fetch all phones for related items
    const phonesRef = ref(database, "Phones/");
    onValue(phonesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const phonesArray = Object.entries(data).map(([phoneId, phoneData]) => ({
          id: phoneId,
          ...phoneData,
        }));
        console.log("All phones:", phonesArray);
        // Filter related phones
        setRelatedPhones(filterRelatedPhones(phonesArray, phone, id));
      } else {
        setRelatedPhones([]);
        console.warn("No phones found in Phones/ collection");
      }
    });
  }, [id, phone]);

  const filterRelatedPhones = (phones, currentPhone, currentId) => {
    if (!currentPhone) return [];

    // Extract brand from name if brand field doesn't exist
    const getBrand = (name) => {
      if (!name) return "";
      const words = name.split(" ");
      return words[0]?.toLowerCase() || "";
    };

    const currentBrand = currentPhone.brand?.toLowerCase() || getBrand(currentPhone.name);
    const currentPrice = parseFloat(currentPhone.price) || 0;
    const priceRange = {
      min: currentPrice * 0.8, // ±20%
      max: currentPrice * 1.2,
    };

    let related = phones
      .filter((p) => p.id !== currentId)
      .filter((p) => {
        const phoneBrand = p.brand?.toLowerCase() || getBrand(p.name);
        const phonePrice = parseFloat(p.price) || 0;
        return phoneBrand === currentBrand || (phonePrice >= priceRange.min && phonePrice <= priceRange.max);
      })
      .slice(0, 8); // Limit to 8 for vertical layout

    // Fallback: Show other phones if no matches
    if (related.length === 0) {
      related = phones
        .filter((p) => p.id !== currentId)
        .slice(0, 8);
    }

    console.log("Related phones:", related);
    return related;
  };

  const handlePhoneClick = (phoneId) => {
    navigate(`/phone/${phoneId}`);
  };

  if (loading) {
    return <div className="loading">Loading phone details...</div>;
  }

  if (!phone) {
    return <div className="error">Phone not found</div>;
  }

  return (
    <div style={styles.page}>
      <button
        style={styles.backButton}
        onClick={() => navigate("/manage-phones")}
      >
        <FaArrowLeft style={styles.icon} /> Back to Phones
      </button>
      <div style={styles.phoneDetails}>
        <h2 style={styles.phoneTitle}>{phone.name}</h2>
        <img
          src={phone.images?.[0] || "path/to/fallback-image.jpg"}
          alt={phone.name}
          style={styles.phoneImage}
        />
        <div style={styles.phoneInfo}>
          <p style={styles.phoneInfoLine}>
            <FaRupeeSign style={styles.icon} /> <strong>Price:</strong> ₹{phone.price}
          </p>
          {phone.phoneLocation && (
            <p style={styles.phoneInfoLine}>
              <strong>Location:</strong> {phone.phoneLocation}
            </p>
          )}
          {phone.description && (
            <p style={styles.phoneInfoLine}>
              <strong>Description:</strong> {phone.description}
            </p>
          )}
          {phone.model && (
            <p style={styles.phoneInfoLine}>
              <strong>Model:</strong> {phone.model}
            </p>
          )}
          {phone.year && (
            <p style={styles.phoneInfoLine}>
              <strong>Year:</strong> {phone.year}
            </p>
          )}
          {phone.postedTime && (
            <p style={styles.phoneInfoLine}>
              <strong>Posted:</strong> {new Date(phone.postedTime).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div style={styles.relatedSection}>
        <h3 style={styles.relatedTitle}>Related Phones</h3>
        {relatedPhones.length === 0 ? (
          <div className="no-related">No related phones found</div>
        ) : (
          <div className="cart-list">
            {relatedPhones.map((relatedPhone) => (
              <div
                key={relatedPhone.id}
                className="cart-item"
                style={styles.cartItem}
                onClick={() => handlePhoneClick(relatedPhone.id)}
              >
                <img
                  src={relatedPhone.images?.[0] || "path/to/fallback-image.jpg"}
                  alt={relatedPhone.name}
                  style={styles.cartImage}
                />
                <div style={styles.cartInfo}>
                  <h4 style={styles.cartTitle}>{relatedPhone.name}</h4>
                  {relatedPhone.phoneLocation && (
                    <p style={styles.cartLine}>
                      <FaMapMarkerAlt style={styles.icon} /> {relatedPhone.phoneLocation}
                    </p>
                  )}
                  <p style={styles.cartLine}>
                    <FaRupeeSign style={styles.icon} /> ₹{relatedPhone.price}
                  </p>
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

        .cart-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          background: #fff;
          border: 1px solid #e0e7ff;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .cart-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 71, 161, 0.2);
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
  phoneDetails: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
    maxWidth: "600px",
    margin: "0 auto 30px",
  },
  phoneTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0d47a1",
    marginBottom: "15px",
  },
  phoneImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "15px",
  },
  phoneInfo: {
    fontSize: "14px",
  },
  phoneInfoLine: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  relatedSection: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  relatedTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0d47a1",
    marginBottom: "15px",
  },
  cartItem: {
    width: "100%",
  },
  cartImage: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    marginRight: "10px",
  },
  cartInfo: {
    flex: 1,
  },
  cartTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0d47a1",
    margin: "0 0 5px",
  },
  cartLine: {
    fontSize: "12px",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    marginRight: "6px",
    color: "#0d47a1",
  },
};

export default PhoneDetails;