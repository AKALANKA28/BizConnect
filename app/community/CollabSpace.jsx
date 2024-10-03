import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Access route params
import { db } from '../../config/FirebaseConfig'; // Firebase config
import { doc, getDoc,updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useEffect } from 'react';
import Header from './Header';
import { useAuth } from "../../context/authContext";

export default function CollabSpace() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [activeTab, setActiveTab] = useState('about'); // State for tab switching
  const { user } = useAuth(); // Assuming you have a hook that provides the logged-in user
  const [isMember, setIsMember] = useState(false);

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
      await updateDoc(postRef, {
        members: arrayUnion(user.uid),
      });
      setIsMember(true);
    } catch (error) {
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
      setIsMember(false);
    } catch (error) {
      console.error("Error leaving CollabSpace: ", error);
    }
  };

  const navigateToUpdateScreen = () => {
    // Navigate to the update screen to edit CollabSpace details
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
              <Image source={{ uri: post.userImage }} style={styles.profileImage} />
              <View>
                <Text style={styles.publisherName}>{post.userName}</Text>
                <Text style={styles.publisherLocation}>{post.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Join Button
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity> */}

        <View style={styles.joinButton}>
      {/* If user is the creator, show the update button */}
      {user && user.uid === post.userId ? (
        <TouchableOpacity style={styles.updateButton} onPress={navigateToUpdateScreen}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
      ) : (
        // If not the creator, show join/leave button based on membership
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
            <Text style={activeTab === 'about' ? styles.activeTabText : styles.inactiveTabText}>About CollabSpace</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'goals' && styles.activeTab]}
            onPress={() => setActiveTab('goals')}
          >
            <Text style={activeTab === 'goals' ? styles.activeTabText : styles.inactiveTabText}>Goals</Text>
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
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>💬</Text>
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
    bottom: 15, // Position the overlay slightly above the bottom of the image
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for contrast
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
  joinButton: {
    backgroundColor: '#B98539',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  joinButtonText: {
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
  inactiveTabText: {
    color: '#888',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#B98539',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  moreImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moreImage: {
    width: '48%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  goalsContainer: {
    marginBottom: 20,
  },
  goalItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#B98539',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
  },
});
