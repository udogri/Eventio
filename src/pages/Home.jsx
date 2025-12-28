import { Box, Heading, Text, Button, VStack, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Layout from "../components/dashboardLayout/Index";
import HeroImg from "../assets/HeroImg.jpg";

export default function Home() {
  return (
    <Layout>
      <Box
        position="relative"           // ✅ REQUIRED
        minH="calc(100vh - 64px)"     // ✅ account for header
        bgImage={`url(${HeroImg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
      >
        {/* Dark overlay */}
        <Box
          position="absolute"
          inset={0}
          bg="blackAlpha.600"
        />

        <Container
          maxW="container.md"
          position="relative"
          zIndex={1}
          h="100%"
        >
          <VStack
            spacing={8}
            py={32}
            textAlign="center"
            color="white"
            minH="100%"
            justify="center"          // ✅ vertical centering
          >
            <Heading fontSize={{ base: "3xl", md: "5xl" }}>
              Eventio
            </Heading>

            <Text fontSize={{ base: "md", md: "lg" }} color="gray.200">
              Find and book event centers, halls, arenas, parks, studios, and rentals
              in just a few clicks.
            </Text>

            <Link to="/venues">
              <Button size="lg" colorScheme="blue">
                Browse Venues
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    </Layout>
  );
}
