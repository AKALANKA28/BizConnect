import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import PostCard from './PostCard'; // Assuming PostCard is imported correctly
import { db } from '../../config/FirebaseConfig'; // Firebase config import
import { getDocs, collection, query, doc as firestoreDoc, getDoc } from 'firebase/firestore'; // Fixed doc import conflict
import { useFocusEffect } from '@react-navigation/native'; // For automatic refresh

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchCollabSpacePosts();
  }, []);

  const fetchCollabSpacePosts = async () => {
    setIsLoading(true); // Start loading
    try {
      // Fetch all CollabSpace posts
      const q = query(collection(db, 'CollabSpaces'));
      const querySnapshot = await getDocs(q);

      // Map through posts to add profile image from entrepreneurs collection
      const postsData = await Promise.all(
        querySnapshot.docs.map(async (postDoc) => {
          const postData = { id: postDoc.id, ...postDoc.data() };

          // Fetch the corresponding entrepreneur profile image using the creator's uid
          const entrepreneurRef = firestoreDoc(db, 'entrepreneurs', postData.userId); // firestoreDoc fixes conflict with doc import
          const entrepreneurSnap = await getDoc(entrepreneurRef);

          // Check if the entrepreneur document exists and get the profileImage
          let profileImage = 'https://www.pikpng.com/pngl/b/417-4172348_testimonial-user-icon-color-clipart.png'; // Default image URL
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
    } finally {
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  // useFocusEffect will refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCollabSpacePosts();
    }, [])
  );

  const renderPost = ({ item }) => <PostCard post={item} />;

  return (
    <View style={styles.feedContainer}>
      {isLoading ? (
        // Show loading spinner while fetching posts
        <ActivityIndicator size="large" color="#FF8C00" style={styles.loader} />
      ) : (
        // Render posts once loading is finished
        posts.length > 0 ? (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={renderPost}
          />
        ) : (
          <Text style={styles.noPostsText}>No posts available</Text>
        )
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
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
