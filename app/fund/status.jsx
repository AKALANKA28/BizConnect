import React, { useState, useEffect } from 'react';
import { View, Text, FlatList,StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

const StatusScreen = () => {
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statusCollection = collection(db, "payments"); // Assuming payments status is stored here
      const statusSnapshot = await getDocs(statusCollection);
      const statusList = statusSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStatuses(statusList);
    };

    fetchStatuses();
  }, []);

  return (
    <View>
      <FlatList
        data={statuses}
        renderItem={({ item }) => (
          <View>
            <Text>{item.paymentAmount} - {item.paymentDate}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 15,
    marginTop: 10,
  },
  navIcon: {
    padding: 10,
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#FF6E40',
    borderRadius: 20,
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#FF6E40',
    borderRadius: 20,
    padding: 10,
  },
  menuText: {
    fontSize: 18,
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2, // Adds shadow
  },
  iconContainer: {
    marginRight: 15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#FF6E40',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  okButton: {
    backgroundColor: '#FF6E40',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignSelf: 'center',
    marginTop: 20,
    width:200,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    margin:'auto'
  },
});

export default StatusScreen;
