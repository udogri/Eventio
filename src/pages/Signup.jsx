import { useState } from "react";
import { Box, Input, Button, Heading, VStack, Text, Link } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true); // toggle between signup/login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Box p={10} maxW="400px" mx="auto">
      <Heading mb={6}>{isSignup ? "Signup" : "Login"}</Heading>
      <VStack spacing={4}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Text color="red.500">{error}</Text>}
        <Button colorScheme="green" w="full" onClick={handleSubmit}>
          {isSignup ? "Signup" : "Login"}
        </Button>
        <Text fontSize="sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <Link
            color="blue.500"
            fontWeight="bold"
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Login" : "Signup"}
          </Link>
        </Text>
      </VStack>
    </Box>
  );
}
