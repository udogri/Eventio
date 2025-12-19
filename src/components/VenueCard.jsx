import {
  Box,
  Image,
  Heading,
  Text,
  Badge,
  Stack,
  Button,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function VenueCard({ venue, isAdmin = false }) {
  const toast = useToast();
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const confirm = window.confirm("Delete this venue?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "venues", venue.id));
      toast({ title: "Venue deleted", status: "success" });
    } catch (err) {
      toast({ title: "Delete failed", status: "error" });
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/edit-venue/${venue.id}`);
  };

  return (
    <Link to={`/venues/${venue.id}`}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        _hover={{ shadow: "md" }}
      >
        <Image
          src={venue.images?.[0]}
          h="200px"
          w="100%"
          objectFit="cover"
        />

        <Box p={4}>
          <Heading size="md" mb={2}>
            {venue.name}
          </Heading>

          <Stack direction="row" mb={2}>
            <Badge colorScheme="blue">
            <Badge colorScheme="blue">{venue.location}</Badge>
            </Badge>
            {venue.capacity > 0 && (
              <Badge colorScheme="purple">
                {venue.capacity} Guests
              </Badge>
            )}
            {/* <Badge>{venue.venueType}</Badge> */}
          </Stack>

          {isAdmin && (
            <HStack mt={3}>
              <Button size="sm" colorScheme="blue" onClick={handleEdit}>
                Edit
              </Button>
              <Button size="sm" colorScheme="red" onClick={handleDelete}>
                Delete
              </Button>
            </HStack>
          )}
        </Box>
      </Box>
    </Link>
  );
}
