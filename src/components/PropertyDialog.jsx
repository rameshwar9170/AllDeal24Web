// src/components/PropertyDialog.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import { useNavigate } from "react-router-dom";

const PropertyDialog = ({ open, onClose }) => {
    const [subCategories, setSubCategories] = useState([]);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoverClose, setHoverClose] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        setLoading(true);
        const propertyRef = ref(database, "App/Category/Property/SubCategory/");
        onValue(propertyRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSubCategories(Object.keys(data));
            } else {
                setSubCategories([]);
            }
            setLoading(false);
        });
    }, [open]);

    const handleSubcategoryClick = (subcategory) => {
        onClose(); // close the dialog
        navigate(`/properties/${subcategory}`);
    };

    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.dialog}>
                <h2 style={styles.title}>Property Subcategories</h2>

                {loading ? (
                    <p style={styles.loadingText}>Loading...</p>
                ) : (
                    <ul style={styles.list}>
                        {subCategories.map((key, idx) => (
                            <li
                                key={idx}
                                style={{
                                    ...styles.listItem,
                                    ...(hoveredItem === idx ? styles.listItemHover : {}),
                                }}
                                onMouseEnter={() => setHoveredItem(idx)}
                                onMouseLeave={() => setHoveredItem(null)}
                                onClick={() => handleSubcategoryClick(key)}
                            >
                                {key}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    onClick={onClose}
                    style={{
                        ...styles.closeBtn,
                        ...(hoverClose ? styles.closeBtnHover : {})
                    }}
                    onMouseEnter={() => setHoverClose(true)}
                    onMouseLeave={() => setHoverClose(false)}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
    dialog: {
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "500px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    title: {
        marginBottom: "20px",
        fontSize: "20px",
        fontWeight: "600",
        color: "#333",
    },
    list: {
        listStyleType: "none",
        padding: 0,
        marginBottom: "20px",
    },
    listItem: {
        padding: "10px",
        backgroundColor: "#f0f0f0",
        borderRadius: "6px",
        marginBottom: "10px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    listItemHover: {
        backgroundColor: "#dbeafe",
        transform: "scale(1.02)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
        border: "2px solid #3b82f6",
        color: "#1e40af",
        fontWeight: "600",
    },
    closeBtn: {
        backgroundColor: "#667eea",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "500",
        fontSize: "14px",
        transition: "all 0.3s ease",
    },
    closeBtnHover: {
        backgroundColor: "#5a67d8",
        transform: "scale(1.05)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
    loadingText: {
        fontSize: "14px",
        fontStyle: "italic",
        color: "#555",
    },
};

export default PropertyDialog;
