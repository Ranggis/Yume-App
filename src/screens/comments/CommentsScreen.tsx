// src/screens/comments/CommentsScreen.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useComments } from "../../Context/CommentContext";

const CommentsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { comments, addComment, toggleLike } = useComments();

  const [newComment, setNewComment] = React.useState("");

  const sendComment = () => {
    if (!newComment.trim()) return;
    addComment(newComment.trim());
    setNewComment("");
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.commentRow}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={{ flex: 1 }}>
        <Text style={styles.username}>{item.user}</Text>
        <Text style={styles.commentText}>{item.text}</Text>

        <View style={styles.commentMeta}>
          <TouchableOpacity onPress={() => toggleLike(item.id)}>
            <Icon
              name={item.liked ? "heart" : "heart-outline"}
              size={16}
              color={item.liked ? "#00C853" : "#999"}
            />
          </TouchableOpacity>

          <Text style={styles.likeCount}>{item.likes}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>

      <TouchableOpacity>
        <Icon name="ellipsis-vertical" size={18} color="#999" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ========== HEADER ========== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{comments.length} Comments</Text>

        <Icon name="ellipsis-vertical" size={20} color="#999" />
      </View>

      {/* ========== COMMENT LIST ========== */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* ========== COMMENT INPUT ========== */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Add comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity style={styles.smileyButton}>
            <Icon name="happy-outline" size={20} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CommentsScreen;

/* ============================
   STYLES (TIDAK DIUBAH)
============================ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E0E",
    paddingTop: 55,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  commentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  username: { color: "#fff", fontWeight: "600", marginBottom: 3 },
  commentText: { color: "#ccc", marginBottom: 6 },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    color: "#999",
    marginLeft: 6,
    marginRight: 10,
    fontSize: 12,
  },
  date: { color: "#777", fontSize: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  smileyButton: {
    paddingHorizontal: 6,
  },
  sendButton: {
    backgroundColor: "#00C853",
    borderRadius: 25,
    padding: 10,
    marginLeft: 5,
  },
});
