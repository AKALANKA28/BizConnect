import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { db } from '../../config/FirebaseConfig';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import * as ImagePicker from 'expo-image-picker'; // For image picking
import { MaterialIcons } from '@expo/vector-icons'; // For the three-dot menu icon
import { Ionicons } from '@expo/vector-icons'; // For back button

export default function UpdateCollabSpace() {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [moreImages, setMoreImages] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (postId) {
      fetchPostDetails(postId);
    }
  }, [postId]);

  const fetchPostDetails = async (id) => {
    try {
      const postRef = doc(db, 'CollabSpaces', id);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const data = postSnap.data();
        setPost(data);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setLocation(data.location || '');
        setGoals(data.goals || []);
        setFeaturedImage(data.featuredImage || null);
        setMoreImages(data.moreImages || []);
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching post details: ', error);
    }
  };

  const handleGoalChange = (text, index) => {
    const updatedGoals = [...goals];
    updatedGoals[index] = text;
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals((prevGoals) => [...prevGoals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index) => {
    setGoals((prevGoals) => {
      const updatedGoals = [...prevGoals];
      updatedGoals.splice(index, 1);
      return updatedGoals;
    });
  };

  const pickImage = async (setImage) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission to access camera roll is required!');
    }
  };

  const removeImage = (index) => {
    setMoreImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const updateCollabSpace = async () => {
    if (!postId) return;

    if (!featuredImage) {
      Alert.alert('Please select a featured image.');
      return;
    }
    if (moreImages.length === 0) {
      Alert.alert('Please add at least one more image.');
      return;
    }

    try {
      const postRef = doc(db, 'CollabSpaces', postId);
      await updateDoc(postRef, {
        title,
        description,
        location,
        featuredImage,
        moreImages,
        goals,
      });
      Alert.alert('Success', 'CollabSpace updated successfully');
      router.push(`/community/CollabSpace?postId=${postId}`);
    } catch (error) {
      console.error('Error updating CollabSpace: ', error);
    }
  };

  const confirmDeleteCollabSpace = () => {
    Alert.alert(
      'Delete CollabSpace',
      'Are you sure you want to delete this CollabSpace?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: deleteCollabSpace,
        },
      ],
      { cancelable: false }
    );
  };

  const deleteCollabSpace = async () => {
    try {
      const postRef = doc(db, 'CollabSpaces', postId);
      await deleteDoc(postRef);
      Alert.alert('Success', 'CollabSpace deleted successfully');
      router.push('/community');
    } catch (error) {
      console.error('Error deleting CollabSpace: ', error);
    }
  };

  if (!post) {
    return <Text>Loading post details...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Update CollabSpace</Text>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialIcons name="more-vert" size={24} color="black" />
        </TouchableOpacity>
        {menuVisible && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={confirmDeleteCollabSpace}>
              <Text style={styles.menuItem}>Delete CollabSpace</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        {/* Featured Image */}
        <Text style={styles.imageTitle}>Featured Image</Text>
        {featuredImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: featuredImage }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setFeaturedImage(null)}
            >
              <Text style={styles.removeImageButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={() => pickImage(setFeaturedImage)}
          >
            <Text style={styles.addImageButtonText}>Add Featured Image</Text>
          </TouchableOpacity>
        )}

        {/* More Images */}
        <Text style={styles.imageTitle}>More Images</Text>
        {moreImages.length > 0 ? (
          moreImages.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No more images added.</Text>
        )}
        <TouchableOpacity
          style={styles.addImageButton}
          onPress={() => {
            pickImage((uri) => setMoreImages((prev) => [...prev, uri]));
          }}
        >
          <Text style={styles.addImageButtonText}>Add More Images</Text>
        </TouchableOpacity>

        {/* Goals Section */}
        <Text style={styles.label}>Goals</Text>
        {goals.map((goal, index) => (
          <View key={index} style={styles.goalContainer}>
            <TextInput
              style={styles.goalInput}
              value={goal}
              onChangeText={(text) => handleGoalChange(text, index)}
            />
            <TouchableOpacity
              style={styles.removeGoalButton}
              onPress={() => removeGoal(index)}
            >
              <Text style={styles.removeGoalButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addGoalContainer}>
          <TextInput
            style={styles.goalInput}
            placeholder="Add a new goal"
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <TouchableOpacity style={styles.addGoalButton} onPress={addGoal}>
            <Text style={styles.addGoalButtonText}>Add Goal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.updateButton} onPress={updateCollabSpace}>
          <Text style={styles.updateButtonText}>Update CollabSpace</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
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
    flex: 1,
    textAlign: "left",
    marginLeft: 30,
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollView: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 4,
    padding: 5,
  },
  removeImageButtonText: {
    color: '#fff',
  },
  addImageButton: {
    backgroundColor: '#607F0E',
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  addImageButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  goalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  removeGoalButton: {
    marginLeft: 10,
    backgroundColor: 'red',
    borderRadius: 4,
    padding: 5,
  },
  removeGoalButtonText: {
    color: '#fff',
  },
  addGoalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addGoalButton: {
    backgroundColor: '#607F0E',
    borderRadius: 4,
    padding: 10,
    marginLeft: 10,
  },
  addGoalButtonText: {
    color: '#fff',
  },
  updateButton: {
    backgroundColor: '#607F0E',
    borderRadius: 4,
    padding: 10,
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  menu: {
    position: 'absolute',
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  menuItem: {
    padding: 10,
  },
});
