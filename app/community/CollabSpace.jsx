import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router'; // Access route params
import { db } from '../../config/FirebaseConfig'; // Firebase config
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from "../../context/authContext";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CollabSpace() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [activeTab, setActiveTab] = useState('about'); // State for tab switching
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const router = useRouter(); 

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
      await updateDoc(postRef, { members: arrayUnion(user.uid) });
      setIsMember(true); // Update UI
    } catch (error) {
      console.error("Error joining CollabSpace: ", error);
    }
  };

  const leaveCollabSpace = async () => {
    if (!user || !postId) return;
    try {
      const postRef = doc(db, 'CollabSpaces', postId);
      await updateDoc(postRef, { members: arrayRemove(user.uid) });
      setIsMember(false); // Update UI
    } catch (error) {
      console.error("Error leaving CollabSpace: ", error);
    }
  };

  const navigateToUpdateScreen = () => {
    router.push({ pathname: '/community/UpdateCollabSpace', params: { postId } });
  };

  const navigateToChatRoom = () => {
    router.push({ pathname: '/community/ChatRoom', params: { chatRoomId: post.chatRoomId } });
  };

  if (!post) {
    return <Text>Loading post details...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CollabSpace</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Featured Image with Overlay */}
        <View style={styles.featuredImageContainer}>
          <Image source={{ uri: post.featuredImage }} style={styles.featuredImage} />
          <View style={styles.overlay}>
            <Text style={styles.title}>{post.title}</Text>
            <View style={styles.publisherInfo}>
              <Image source={{ uri: post.userImage }} style={styles.profileImage} />
              <View>
                <Text style={styles.publisherName}>{post.userName}</Text>
                <Text style={styles.publisherLocation}>{post.location}</Text>
              </View>
            </View>
          </View>
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

          {/* Join Button */}
          <TouchableOpacity
            style={styles.joinButton}
            onPress={isMember ? leaveCollabSpace : joinCollabSpace}
          >
            <Text style={styles.buttonText}>{isMember ? "Joined" : "Join"}</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' ? (
          <View>
            <Text style={styles.sectionTitle}>Welcome to my CollabSpace</Text>
            <Text style={styles.description}>{post.description}</Text>
            {/* Image Grid */}
            <View style={styles.moreImagesContainer}>
              {post.moreImages?.map((imageUri, index) => (
                <Image key={index} source={{ uri: imageUri }} style={styles.moreImage} />
              ))}
            </View>
          </View>
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
        <Icon name="chat" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    marginBottom: 0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
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
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  joinButton: {
    backgroundColor: '#B98539',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  moreImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moreImage: {
    width: '48%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  goalsContainer: {
    marginTop: 10,
  },
  goalItem: {
    fontSize: 16,
    color: '#666',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
