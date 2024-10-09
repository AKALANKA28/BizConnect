import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import PostCard from './PostCard'; // Assuming PostCard is imported correctly
import { db } from '../../config/FirebaseConfig'; // Firebase config import
import { getDocs, collection, query } from 'firebase/firestore';

export default function CommunityFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchCollabSpacePosts();
  }, []);

  const fetchCollabSpacePosts = async () => {
    try {
      const q = query(collection(db, 'CollabSpaces')); // Fetching from 'collabspace' collection
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Adding a sample profile image for now
      const postsWithProfileImage = postsData.map(post => ({
        ...post,
        profileImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbxcbt8ejR6RhFF5ysw97gpXm6yf0woiXAig&s', // Replace with actual image URL
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
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});
