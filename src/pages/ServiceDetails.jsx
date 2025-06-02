import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebase";
import { FiTrash2 } from "react-icons/fi";

const ServiceDetails = () => {
  const { id } = useParams();
  const [nestedServices, setNestedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const service = location.state?.service;

  useEffect(() => {
    if (!id) return;
    const nestedRef = ref(database, `App/Services/${id}/Service/`);
    onValue(nestedRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([serviceId, details]) => ({
          serviceId,
          ...details,
        }));
        setNestedServices(list);
      } else {
        setNestedServices([]);
      }
      setLoading(false);
    });
  }, [id]);

  const handleDelete = (serviceId) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const deleteRef = ref(database, `App/Services/${id}/Service/${serviceId}`);
      remove(deleteRef)
        .then(() => {
          console.log("Service deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting service:", error);
        });
    }
  };

  return (
    <div className="page-container">
      <div className="header">
        <h2 className="title">{service?.title || "Service Details"}</h2>
        <span className="count">{nestedServices.length} Total</span>
      </div>

      {loading ? (
        <div className="loading">Loading service details...</div>
      ) : (
        <div className="card-grid">
          {nestedServices.map((nested) => (
            <div key={nested.serviceId} className="card-hover">
              <img
                src={nested.imageUrl}
                alt={nested.title}
                className="card-image"
              />
              <div className="card-content">
                <h3 className="card-title">{nested.title}</h3>
                <p className="card-description">{nested.description}</p>
                <div className="card-line">
                  <strong>Location:</strong> {nested.location}
                </div>
                <div className="card-line">
                  <strong>Call:</strong> {nested.callingNumber}
                </div>
                <div className="card-line">
                  <strong>WhatsApp:</strong> {nested.whatsappNumber}
                </div>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(nested.serviceId)}
                >
                  <FiTrash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .page-container {
          padding: 20px;
          font-family: "Poppins", sans-serif;
        }

        .header {
          background: linear-gradient(135deg, #2563eb, #1e3a8a);
          padding: 10px 20px;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          border-radius: 0 0 12px 12px;
          margin-bottom: 20px;
        }

        .title {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
        }

        .count {
          font-size: 16px;
          color: #cbd5ff;
        }

        .loading {
          text-align: center;
          font-size: 18px;
          margin-top: 50px;
          color: #555;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .card-hover {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-hover:hover {
          transform: scale(1.02);
          box-shadow: 0 12px 30px rgba(13, 71, 161, 0.3);
        }

        .card-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .card-content {
          padding: 14px 16px;
        }

        .card-title {
          margin: 10px 0 6px;
          color: #0d47a1;
          font-size: 16px;
          font-weight: 600;
        }

        .card-description {
          font-size: 14px;
          color: #555;
          margin-bottom: 10px;
        }

        .card-line {
          margin-bottom: 6px;
          font-size: 13.5px;
        }

        .delete-button {
  margin-top: 12px;
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  width: 100%;
  transition: background-color 0.2s ease;
}


        .delete-button:hover {
          background-color: #b91c1c;
        }

        @media (max-width: 500px) {
          .card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceDetails;
