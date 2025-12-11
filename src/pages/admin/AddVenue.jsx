import { Box, Input, Button, VStack, Heading, Textarea } from '@chakra-ui/react';


export default function CreateVenue() {
return (
<Box p={6} maxW="600px" mx="auto">
<Heading size="lg" mb={4}>Add New Venue</Heading>
<VStack spacing={4}>
<Input placeholder="Venue Name" />
<Textarea placeholder="Description" />
<Input placeholder="Price" />
<Input type="file" />
<Button colorScheme="blue">Upload</Button>
</VStack>
</Box>
);
}