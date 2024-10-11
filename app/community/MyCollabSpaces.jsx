import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import PostCard from './PostCard'; // Assuming PostCard is imported correctly
import { db, auth } from '../../config/FirebaseConfig'; // Firebase and Auth config import
import { getDocs, collection, query, where, doc as firestoreDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // To detect the logged-in user

export default function MyCollabSpaces() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState(null); // To store the current user's UID

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Get the current logged-in user's UID
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserCollabSpaces(userId);
    }
  }, [userId]); // Fetch posts when userId is available

  const fetchUserCollabSpaces = async (userId) => {
    try {
      const q = query(collection(db, 'CollabSpaces'), where('userId', '==', userId)); // Fetch only posts by the logged-in user
      const querySnapshot = await getDocs(q);
      
      // Map through posts to add profile image from entrepreneurs collection
      const postsData = await Promise.all(
        querySnapshot.docs.map(async (postDoc) => {
          const postData = { id: postDoc.id, ...postDoc.data() };

          // Fetch the corresponding entrepreneur profile image using the creator's uid
          const entrepreneurRef = firestoreDoc(db, 'entrepreneurs', postData.userId);
          const entrepreneurSnap = await getDoc(entrepreneurRef);

          // Check if the entrepreneur document exists and get the profileImage
          let profileImage = null; // Default image URL
          if (entrepreneurSnap.exists()) {
            profileImage = entrepreneurSnap.data().profileImage || profileImage;
          }

          // Return the post data with the profile image
          return { ...postData, profileImage };
        })
      );

      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    }
  };

  const renderPost = ({ item }) => <PostCard post={item} />;

  return (
    <View style={styles.feedContainer}>
      {posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
