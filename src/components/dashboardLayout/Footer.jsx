import { Box, Flex, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box bg="gray.800" color="white" py={4} mt={10}>
      <Flex maxW="1200px" mx="auto" px={4} justify="center">
        <Text fontSize="sm">© {new Date().getFullYear()} My App</Text>
      </Flex>
    </Box>
  );
}
