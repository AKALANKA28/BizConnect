import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { collection, query, where, onSnapshot, addDoc, orderBy } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useAuth } from "../../context/authContext";
import { useLocalSearchParams } from 'expo-router'; // Access route params

export default function ChatScreen() {
  const { chatRoomId } = useLocalSearchParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);

  // Fetch messages from Firestore for the relevant chat room
  useEffect(() => {
    const messagesRef = collection(db, "Messages");
    const q = query(messagesRef, where("chatRoomId", "==", chatRoomId), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [chatRoomId]);

  // Scroll to the bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send a message to Firestore
  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, "Messages"), {
        chatRoomId,
        userId: user.uid,
        userName: user.username,
        message: newMessage,
        createdAt: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      {/* Message list */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.messageContainer,
            item.userId === user.uid ? styles.sentMessage : styles.receivedMessage
          ]}>
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
          </View>
        )}
        ref={flatListRef}
        contentContainerStyle={styles.messageList}
      />

      {/* Input for sending new message */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: "80%",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    alignSelf: "flex-start",
  },
  sentMessage: {
    backgroundColor: "#dcf8c6",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  timestamp: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
    alignSelf: "flex-end",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#25D366",
    padding: 10,
    borderRadius: 50,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
