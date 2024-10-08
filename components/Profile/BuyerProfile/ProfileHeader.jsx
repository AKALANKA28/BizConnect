import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ProfileHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7feb1d78bbd74a0e82a54e5a174ea8bd65e5a74faf472397fb3e761e36fab16a?placeholderIfAbsent=true&apiKey=59e835da8ea04b80ab8ace77cb34d866",
        }}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Arun Perera</Text>
        <Text style={styles.title}>Hand loom Product Exporter</Text>
      </View>

      {/* Three-dots menu icon */}
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Icon name="more-vert" size={26} color="#333" />
      </TouchableOpacity>

      {/* Menu Modal */}
      {menuVisible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={menuVisible}
          onRequestClose={() => setMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setMenuVisible(false)}
          >
            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem}>
                <Icon
                  name="edit"
                  size={20}
                  color="#333"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Icon
                  name="photo-camera"
                  size={20}
                  color="#333"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Set Profile Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Icon
                  name="logout"
                  size={20}
                  color="#333"
                  style={styles.menuItemIcon}
                />
                <Text style={styles.menuItemText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 25,
    padding: 10,
  },
  profileImage: {
    width: 110,
    aspectRatio: 1,
    marginTop: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: "poppins-semibold",
    color: "rgba(51, 51, 51, 1)",
    fontWeight: "400",
  },
  title: {
    fontSize: 12,
    fontFamily: "poppins-semibold",
    color: "rgba(51, 51, 51, 1)",
    fontWeight: "400",
  },
  menuButton: {
    position: "absolute", // Make the three dots absolute
    right: 0, // Align to the right
    top: 10, // Align at the top
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.1)", // Light transparent overlay like Telegram
    justifyContent: "flex-start", // Align menu to the top
    alignItems: "flex-end", // Align menu to the right
  },
  menu: {
    backgroundColor: "#FFF",
    width: 180,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginRight: 15,
    marginTop: 10, // Slight gap between icon and menu
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuItemIcon: {
    marginRight: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ProfileHeader;
