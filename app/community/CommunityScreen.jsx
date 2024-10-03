import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import SearchBar from './SearchBar';
import TabBar from './TabBar';
import CommunityFeed from './CommunityFeed';
import MyCollabSpaces from './MyCollabSpaces'; // MyCollabSpaces component
import FloatingActionButton from './FloatingActionButton';
import { useRouter } from 'expo-router'; // Import useRouter for navigation




const CommunityScreen = () => {
  const [activeTab, setActiveTab] = useState('My feed');
  const router = useRouter();

  const renderContent = () => {
    if (activeTab === 'My feed') {
      return <CommunityFeed />;
    } else if (activeTab === 'My CollabSpaces') {
      return <MyCollabSpaces />;
    }
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <TabBar
        tabs={['My feed', 'My CollabSpaces']}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
      {renderContent()}
      <FloatingActionButton onPress={() => router.push('/community/CollabSpaceForm')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default CommunityScreen;
