import { Box, Heading, Text, Button, VStack, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Layout from "../components/dashboardLayout/Index";

export default function Home() {
  return (
    <Layout>
    <Container maxW="container.md">
      <VStack spacing={8} py={20} textAlign="center">
        <Heading fontSize={{ base: "2xl", md: "4xl" }}>
          Eventio
        </Heading>

        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
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
    </Layout>
  );
}
