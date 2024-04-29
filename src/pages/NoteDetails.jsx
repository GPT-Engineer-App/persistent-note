import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Button, Flex, Input, Text, VStack, useToast } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import { client } from "lib/crud";

const NoteDetails = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchNote();
    fetchComments();
  }, []);

  const fetchNote = async () => {
    const fetchedNote = await client.get(id);
    if (fetchedNote) {
      setNote(fetchedNote[0].value);
    }
  };

  const fetchComments = async () => {
    const fetchedComments = await client.getWithPrefix(`${id}:comment:`);
    if (fetchedComments) {
      setComments(fetchedComments.map((comment) => ({ id: comment.key, ...comment.value })));
    }
  };

  const addComment = async () => {
    if (commentInput.trim() === "") {
      toast({
        title: "Cannot add empty comment",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const commentId = `${id}:comment:${Date.now()}`;
    const newComment = { id: commentId, text: commentInput };
    const success = await client.set(commentId, { text: commentInput });
    if (success) {
      setComments([...comments, newComment]);
      setCommentInput("");
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Link to="/">
        <Button leftIcon={<FaArrowLeft />} colorScheme="teal" mb={5}>
          Back to Notes
        </Button>
      </Link>
      {note && (
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl">{note.text}</Text>
          <Flex>
            <Input placeholder="Add a comment..." value={commentInput} onChange={(e) => setCommentInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addComment()} />
            <Button ml={2} onClick={addComment} colorScheme="blue">
              Add Comment
            </Button>
          </Flex>
          <VStack spacing={4}>
            {comments.map((comment) => (
              <Box key={comment.id} p={3} w="100%" borderWidth="1px" borderRadius="lg">
                <Text>{comment.text}</Text>
              </Box>
            ))}
          </VStack>
        </VStack>
      )}
    </Box>
  );
};

export default NoteDetails;
