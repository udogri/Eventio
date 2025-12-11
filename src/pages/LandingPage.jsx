import { Box, Heading, Text, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";


export function LandingPage() {
    return (
        <Box p={10} textAlign="center" bg="gray.50" minH="100vh">
            <VStack spacing={6}>
                <Heading fontSize="4xl">Find the Perfect Place for Your Event</Heading>
                <Text maxW="600px">
                    Discover event centers, sport arenas, parks, and all rental items you
                    need for your next event.
                </Text>
                <Link to="/venues">
                    <Button size="lg" colorScheme="blue">Get Started</Button>
                </Link>
            </VStack>
        </Box>
    );
}