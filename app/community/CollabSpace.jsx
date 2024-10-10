import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Access route params
import { db } from '../../config/FirebaseConfig'; // Firebase config
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import Header from './Header';
import { useAuth } from "../../context/authContext";

export default function CollabSpace() {
  const { postId, proPic } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [activeTab, setActiveTab] = useState('about'); // State for tab switching
  const { user } = useAuth(); // Assuming you have a hook that provides the logged-in user
  const [isMember, setIsMember] = useState(false);
  const router = useRouter(); 

  console.log('in collabspace' + proPic );

  useEffect(() => {
    if (postId) {
      fetchPostDetails(postId);
    }
  }, [postId]);

  useEffect(() => {
    if (post && user) {
      setIsMember(post.members?.includes(user.uid));
    }
  }, [post, user]);

  const fetchPostDetails = async (id) => {
    try {
      const postRef = doc(db, 'CollabSpaces', id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setPost(postSnap.data());
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching post details: ', error);
    }
  };

  const joinCollabSpace = async () => {
    if (!user || !postId) return;
    try {
      const postRef = doc(db, 'CollabSpaces', postId);
      // Add user to CollabSpace
      await updateDoc(postRef, {
        members: arrayUnion(user.uid),
      });

      // Add user to the relevant chat room
      const chatRoomRef = doc(db, 'ChatRooms', post.chatRoomId); // Assuming the chat room has the same ID as the CollabSpace
      await updateDoc(chatRoomRef, {
        members: arrayUnion(user.uid),
      });

      setIsMember(true); // Update UI
    } catch (error) {
      console.log(postId);
      console.error("Error joining CollabSpace: ", error);
    }
  };

  const leaveCollabSpace = async () => {
    if (!user || !postId) return;
    try {
      const postRef = doc(db, 'CollabSpaces', postId);
      await updateDoc(postRef, {
        members: arrayRemove(user.uid),
      });

      // Remove user from the relevant chat room
      const chatRoomRef = doc(db, 'ChatRooms', post.chatRoomId);
      await updateDoc(chatRoomRef, {
        members: arrayRemove(user.uid),
      });

      setIsMember(false); // Update UI
    } catch (error) {
      console.error("Error leaving CollabSpace: ", error);
    }
  };

  const navigateToUpdateScreen = () => {
    router.push({
      pathname: '/community/UpdateCollabSpace', 
      params: { postId }, // Pass the postId to the update screen
    });
  };

  const navigateToChatRoom = () => {
    router.push({
      pathname: '/community/ChatRoom',
      params: { chatRoomId: post.chatRoomId }, // Pass only the post ID
    });
  };

  if (!post) {
    return <Text>Loading post details...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      <Header title="CollabSpace" />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Featured Image with Overlay */}
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: post.featuredImage }} style={styles.featuredImage} />

          {/* Overlay for title and publisher info */}
          <View style={styles.overlay}>
            <Text style={styles.title}>{post.title}</Text>

            {/* Publisher Info */}
            <View style={styles.publisherInfo}>
              <Image source={{ uri: proPic }} style={styles.profileImage} />
              <View>
                <Text style={styles.publisherName}>{post.userName}</Text>
                <Text style={styles.publisherLocation}>{post.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Join Button */}
        <View style={styles.joinButtonContainer}>
          {user && user.uid === post.userId ? (
            <TouchableOpacity style={styles.updateButton} onPress={navigateToUpdateScreen}>
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={isMember ? leaveCollabSpace : joinCollabSpace}
            >
              <Text style={styles.buttonText}>{isMember ? "Joined (Leave)" : "Join"}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Section */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={activeTab === 'about' ? styles.activeTabText : styles.inactiveTabText}>
              About CollabSpace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'goals' && styles.activeTab]}
            onPress={() => setActiveTab('goals')}
          >
            <Text style={activeTab === 'goals' ? styles.activeTabText : styles.inactiveTabText}>
              Goals
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <>
            <Text style={styles.sectionTitle}>Welcome to my CollabSpace</Text>
            <Text style={styles.description}>{post.description}</Text>

            {/* More Images */}
            <View style={styles.moreImagesContainer}>
              {post.moreImages?.map((imageUri, index) => (
                <Image key={index} source={{ uri: imageUri }} style={styles.moreImage} />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.goalsContainer}>
            <Text style={styles.sectionTitle}>Goals</Text>
            {post.goals?.map((goal, index) => (
              <Text key={index} style={styles.goalItem}>{`${index + 1}. ${goal}`}</Text>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={navigateToChatRoom}>
  <Image 
    source={require('../../assets/icons/Chat.png')} // Update the path to your icon
    style={styles.fabIcon} 
  />
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  featuredImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 15, 
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  publisherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  publisherName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  publisherLocation: {
    fontSize: 12,
    color: '#ddd',
  },
  joinButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  joinButton: {
    backgroundColor: '#B98539',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  updateButton: {
    backgroundColor: '#B98539',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  activeTab: {
    borderBottomColor: '#B98539',
  },
  activeTabText: {
    color: '#B98539',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inactiveTabText: {
    color: '#888',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  moreImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  moreImage: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  goalsContainer: {
    marginTop: 20,
  },
  goalItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#B98539',
    borderRadius: 50,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabIcon: {
    width: 34, // Set the width of your icon
    height: 34, // Set the height of your icon
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
