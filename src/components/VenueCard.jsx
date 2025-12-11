import { Box, Image, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function VenueCard({ venue, maxH = "350px" }) {
  return (
    <Link to={`/venues/${venue.id}`}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        shadow="md"
        height={maxH}            // Fixed height

        _hover={{ shadow: "xl" }}
      >
        <Image src={venue.images[0]} alt={venue.name} />

        <VStack p={4} align="start">
          <Text fontWeight="bold" fontSize="lg">{venue.name}</Text>
          <Text>{venue.location}</Text>
          <Text fontWeight="bold">₦{venue.price.toLocaleString()}</Text>
        </VStack>
      </Box>
    </Link>
  );
}
