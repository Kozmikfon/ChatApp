import React, { useState } from "react";
import { View } from "react-native";
import { TextInput, Button, Subheading } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/core";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const getErrorMessage = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "Bu e-posta zaten kullanımda.";
      case "auth/invalid-email":
        return "Geçersiz e-posta adresi.";
      case "auth/weak-password":
        return "Şifre çok zayıf. En az 6 karakter olmalıdır.";
      default:
        return "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
  };

  const createAccount = async () => {
    if (!name || !email || !password) {
      setError("Tüm alanları doldurmalısınız.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setIsLoading(true);
    setError(""); // Önceki hatayı temizle

    try {
      const response = await auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({ displayName: name });
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
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
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
        <Button compact onPress={() => navigation.navigate("SignIn")}>
          Sign In
        </Button>
        <Button
          mode="contained"
          onPress={createAccount}
          loading={isLoading}
        >
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default SignUp;
