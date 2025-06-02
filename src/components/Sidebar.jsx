import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FaTachometerAlt,
    FaHome,
    FaCar,
    FaMobileAlt,
    FaTools,
    FaUsers,
    FaCarSide,
    FaTruck,
    FaMotorcycle,
    FaBars,
    FaChevronDown,
} from "react-icons/fa";

const menuItems = [
    { to: "/", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/properties", icon: <FaHome />, label: "Properties" },
    {
        icon: <FaCar />,
        label: "Vehicles",
        subItems: [
            { to: "/manage-cars", label: "Cars", icon: <FaCarSide /> },
            { to: "/manage-coomercial-vehicles", label: "Commercial Vehicles", icon: <FaTruck /> },
            { to: "/manage-bikes", label: "Bikes", icon: <FaMotorcycle /> },
        ],
    },
    { to: "/manage-phones", icon: <FaMobileAlt />, label: "Phones" },
    { to: "/services", icon: <FaTools />, label: "Services" },
    { to: "/manage-users", icon: <FaUsers />, label: "Users" },
];


const Sidebar = ({ collapsed, setCollapsed }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [openSubMenu, setOpenSubMenu] = useState(null); // For dropdown toggle

    return (
        <div style={{ ...styles.sidebar, width: collapsed ? "60px" : "240px" }}>
            {/* Logo and Toggle Button */}
            <div style={styles.topSection}>
    {!collapsed && (
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <span style={styles.logoText}>Alldeal24</span>
        </Link>
    )}
    <button onClick={() => setCollapsed(!collapsed)} style={styles.toggleBtn}>
        <FaBars />
    </button>
</div>


            {/* Menu Items */}
            <ul style={styles.menu}>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        {item.subItems ? (
                            <>
                                <div
                                    style={{
                                        ...styles.link,
                                        cursor: "pointer",
                                        ...(hoveredIndex === index ? styles.linkHover : {}),
                                    }}
                                    onClick={() => {
                                        if (collapsed) {
                                            setCollapsed(false);
                                        } else {
                                            setOpenSubMenu(openSubMenu === index ? null : index);
                                        }
                                    }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <span style={styles.menuItemIcon}>{item.icon}</span>
                                    {!collapsed && (
                                        <span
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                width: "100%",
                                            }}
                                        >
                                            {item.label}
                                            {item.subItems && (
                                                <FaChevronDown
                                                    style={{
                                                        ...styles.dropdownIcon,
                                                        transform:
                                                            openSubMenu === index
                                                                ? "rotate(180deg)"
                                                                : "rotate(0deg)",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                />
                                            )}
                                        </span>
                                    )}
                                </div>

                                {/* Submenu Items */}
                                {!collapsed && openSubMenu === index && (
                                    <ul style={styles.subMenu}>
                                        {item.subItems.map((subItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                onMouseEnter={() =>
                                                    setHoveredIndex(`${index}-${subIndex}`)
                                                }
                                                onMouseLeave={() => setHoveredIndex(null)}
                                            >
                                                <Link
                                                    to={subItem.to}
                                                    onClick={() =>
                                                        collapsed && setCollapsed(false)
                                                    }
                                                    style={{
                                                        ...styles.subLink,
                                                        ...(hoveredIndex ===
                                                        `${index}-${subIndex}`
                                                            ? styles.subLinkHover
                                                            : {}),
                                                    }}
                                                >
                                                    <span style={styles.subItemIcon}>
                                                        {subItem.icon}
                                                    </span>
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        ) : (
                            <Link
                                to={item.to}
                                onClick={() => collapsed && setCollapsed(false)}
                                style={{
                                    ...styles.link,
                                    ...(hoveredIndex === index ? styles.linkHover : {}),
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {item.icon} {!collapsed && item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};




const styles = {
    sidebar: {
        backgroundColor: "#0d47a1",
        color: "#fff",
        minHeight: "100vh",
        transition: "width 0.3s ease",
        overflowX: "hidden",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        fontFamily: "Poppins, sans-serif",
        paddingTop: "20px",
    },
    topSection: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 15px",
        marginBottom: "30px",
    },
    toggleBtn: {
        background: "transparent",
        border: "none",
        color: "#fff",
        fontSize: "16px",
        marginLeft: "2px",
        cursor: "pointer",
    },
    logoText: {
        fontSize: "18px",
        fontWeight: "600",
    },
    menu: {
        listStyle: "none",
        padding: "0 10px",
    },
    link: {
        display: "flex",
        alignItems: "center",
        color: "#fff",
        textDecoration: "none",
        padding: "10px 8px",
        fontSize: "15px",
        gap: "10px",
        borderRadius: "6px",
        transition: "all 0.25s ease",
    },
    linkHover: {
        backgroundColor: "rgba(255, 255, 255, 0.1)", // soft blue-glass feel
        transform: "scale(1.03) translateX(6px)",   // subtle lift and shift
        fontWeight: "500",                          // bolder text
        boxShadow: "0 4px 12px rgba(13, 71, 161, 0.3)", // slight blue shadow
    },
    subMenu: {
        paddingLeft: "20px",
        marginTop: "5px",
        listStyle: "none", // ✅ THIS removes the bullet
        marginBottom: "10px", // optional spacing
    },
    

    subLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 10px",
        fontSize: "13px",             // Smaller than main items
        color: "#e0e0e0",             // Light gray for sidebar theme
        textDecoration: "none",
        borderRadius: "6px",
        transition: "all 0.3s ease",
    },

    subLinkHover: {
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        fontWeight: "500",
    },

    subItemIcon: {
        fontSize: "14px",
        color: "#e0e0e0",
        background: "transparent",
        borderRadius: "0",
        padding: "0",
        margin: "0",
        lineHeight: "1",
        width: "auto",
        height: "auto",
        display: "inline-flex", // important to prevent icon circle
        alignItems: "center",
        justifyContent: "center",
    },
    
    dropdownIcon: {
        fontSize: "12px",
        color: "#ccc",
        marginLeft: "auto",
        transition: "transform 0.3s ease",
    },

};

export default Sidebar;
