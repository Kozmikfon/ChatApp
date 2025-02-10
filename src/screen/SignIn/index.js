import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Subheading } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/core";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "Geçersiz e-posta adresi.";
      case "auth/user-not-found":
        return "Bu e-posta ile kayıtlı kullanıcı bulunamadı.";
      case "auth/wrong-password":
        return "Yanlış şifre girdiniz.";
      default:
        return "Bir hata oluştu. Tekrar deneyin.";
    }
  };

  const signIn = async () => {
    if (!email || !password) {
      setError("Email ve şifre boş bırakılamaz.");
      return;
    }

    setIsLoading(true);
    setError(""); // Önceki hatayı temizle

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.popToTop();
    } catch (e) {
      setError(getErrorMessage(e.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      {!!error && (
        <Subheading
          style={{ color: "red", textAlign: "center", marginBottom: 16 }}
        >
          {error}
        </Subheading>
      )}
      <TextInput
        label="Email"
        style={{ marginTop: 12 }}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        style={{ marginTop: 12 }}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button compact onPress={() => navigation.navigate("SignUp")}>
          Sign Up
        </Button>
        <Button mode="contained" onPress={signIn} loading={isLoading}>
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default SignIn;
