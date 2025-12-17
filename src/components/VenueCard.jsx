import { Box, Image, Heading, Text, Badge, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";


export default function VenueCard({ venue }) {
return (
<Link to={`/venues/${venue.id}`}>
<Box borderWidth="1px" borderRadius="lg" overflow="hidden" _hover={{ shadow: "md" }}>
<Image src={venue.images?.[0]} h="200px" w="100%" objectFit="cover" />
<Box p={4}>
<Heading size="md" mb={2}>{venue.name}</Heading>
<Stack direction="row" mb={2}>
<Badge colorScheme="blue">{venue.location}</Badge>
<Badge colorScheme="purple">{venue.capacity} Guests</Badge>
</Stack>
<Text fontWeight="bold">₦{venue.price?.toLocaleString()}</Text>
</Box>
</Box>
</Link>
);
}