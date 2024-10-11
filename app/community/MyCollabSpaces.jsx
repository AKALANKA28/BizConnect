import React, { useEffect, useState,useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import PostCard from './PostCard'; // Assuming PostCard is imported correctly
import { db, auth } from '../../config/FirebaseConfig'; // Firebase and Auth config import
import { getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; // To detect the logged-in user
import { useFocusEffect } from '@react-navigation/native'; // For automatic refresh

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
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Adding a sample profile image for now
      const postsWithProfileImage = postsData.map((post) => ({
        ...post,
        profileImage:
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbxcbt8ejR6RhFF5ysw97gpXm6yf0woiXAig&s', // Replace with actual image URL
      }));

      setPosts(postsWithProfileImage);
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
